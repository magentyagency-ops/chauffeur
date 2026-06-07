import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Determine the host for success/cancel URLs
    const host = req.headers.get('host');
    const protocol = host?.includes('localhost') ? 'http' : 'https';
    const baseUrl = `${protocol}://${host}`;

    // Ensure you have a STRIPE_PRICE_ID in your env vars (the 29€/month price)
    const priceId = process.env.STRIPE_PRICE_ID;

    if (!priceId) {
      console.error('STRIPE_PRICE_ID is not set in environment variables.');
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }

    // Check if user already has a stripe customer id in database
    const { data: profile } = await supabase
      .from('driver_profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    if (!customerId) {
      // Create a new customer in Stripe
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;

      // We'll let the webhook handle saving the customer ID, or we can save it now.
      // But saving it now is safer.
      const { error } = await supabaseAdmin()
        .from('driver_profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
        
      if (error) {
         console.error('Error updating profile with customer ID', error);
      }
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${baseUrl}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing`,
      metadata: {
        supabase_user_id: user.id,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// We need the admin client to bypass RLS if updating server-side, 
// though updating own profile should pass RLS. Let's use standard client but be careful.
// Actually, using the admin client is safer here. Let's fetch it.
import { createAdminClient } from '@/lib/supabase/admin';
function supabaseAdmin() {
    return createAdminClient();
}
