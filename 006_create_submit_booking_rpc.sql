-- ============================================
-- SPRINT 6 — Create submit_booking RPC
-- Run this in Supabase SQL Editor
-- ============================================

CREATE OR REPLACE FUNCTION public.submit_booking(
    p_driver_id UUID,
    p_client_name TEXT,
    p_client_phone TEXT,
    p_client_email TEXT,
    p_pickup_address TEXT,
    p_destination_address TEXT,
    p_booking_type TEXT,
    p_scheduled_at TIMESTAMPTZ,
    p_notes TEXT
)
RETURNS JSON AS $$
DECLARE
    v_client_id UUID;
    v_booking_id UUID;
BEGIN
    -- 1. Upsert Client (Find by phone & driver_id, or create)
    INSERT INTO public.clients (driver_id, full_name, phone, email)
    VALUES (p_driver_id, p_client_name, p_client_phone, p_client_email)
    ON CONFLICT (driver_id, phone)
    DO UPDATE SET 
        full_name = EXCLUDED.full_name,
        email = COALESCE(EXCLUDED.email, public.clients.email),
        updated_at = NOW()
    RETURNING id INTO v_client_id;

    -- 2. Create Booking
    INSERT INTO public.bookings (
        driver_id,
        client_id,
        client_name,
        client_phone,
        client_email,
        pickup_address,
        destination_address,
        booking_type,
        scheduled_at,
        notes,
        status,
        source
    ) VALUES (
        p_driver_id,
        v_client_id,
        p_client_name,
        p_client_phone,
        p_client_email,
        p_pickup_address,
        p_destination_address,
        p_booking_type,
        p_scheduled_at,
        p_notes,
        'pending',
        'public_page'
    ) RETURNING id INTO v_booking_id;

    -- Return JSON object
    RETURN json_build_object('booking_id', v_booking_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
