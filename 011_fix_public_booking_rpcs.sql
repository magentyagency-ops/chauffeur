-- ============================================
-- FIX CRITIQUE — RPCs pour accès public aux statuts de réservation
-- Exécuter dans le SQL Editor de Supabase
-- ============================================

-- 1. RPC pour lire le statut d'une réservation (Accès public, bypass RLS)
CREATE OR REPLACE FUNCTION public.get_booking_status(p_booking_id UUID)
RETURNS JSON AS $$
DECLARE
    v_status TEXT;
    v_eta INTEGER;
BEGIN
    SELECT status, driver_eta_minutes INTO v_status, v_eta
    FROM public.bookings
    WHERE id = p_booking_id;
    
    IF NOT FOUND THEN
        RETURN NULL;
    END IF;
    
    RETURN json_build_object('status', v_status, 'eta', v_eta);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. RPC pour annuler une réservation côté client (Accès public, bypass RLS)
CREATE OR REPLACE FUNCTION public.cancel_booking_public(p_booking_id UUID)
RETURNS JSON AS $$
DECLARE
    v_booking RECORD;
BEGIN
    SELECT id, status, driver_id, client_name INTO v_booking
    FROM public.bookings
    WHERE id = p_booking_id;

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Réservation introuvable.');
    END IF;

    IF v_booking.status IN ('completed', 'cancelled', 'refused') THEN
        RETURN json_build_object('success', false, 'error', 'Cette course ne peut plus être annulée.');
    END IF;

    -- Update status
    UPDATE public.bookings 
    SET status = 'cancelled', updated_at = NOW() 
    WHERE id = p_booking_id;

    -- Create event
    INSERT INTO public.booking_events (booking_id, driver_id, event_type, previous_status, new_status, message)
    VALUES (p_booking_id, v_booking.driver_id, 'status_cancelled', v_booking.status, 'cancelled', 'Annulée par le client.');

    -- Create notification
    INSERT INTO public.notifications (driver_id, booking_id, type, title, message)
    VALUES (v_booking.driver_id, p_booking_id, 'booking_cancelled', 'Réservation annulée', v_booking.client_name || ' a annulé sa réservation.');

    RETURN json_build_object('success', true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
