CREATE TABLE public.website_requests (
 id uuid PRIMARY KEY,
 reference text NOT NULL UNIQUE,
 request_type text NOT NULL CHECK (request_type IN ('service','quotation','partnership')),
 name text NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
 email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
 company text NOT NULL DEFAULT '' CHECK (char_length(company) <= 150),
 service text NOT NULL CHECK (char_length(service) BETWEEN 1 AND 150),
 message text NOT NULL CHECK (char_length(message) BETWEEN 10 AND 3000),
 status text NOT NULL DEFAULT 'new',
 created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.website_requests TO service_role;
ALTER TABLE public.website_requests ENABLE ROW LEVEL SECURITY;
CREATE INDEX website_requests_email_created_idx ON public.website_requests (email, created_at);
CREATE OR REPLACE FUNCTION public.submit_website_request(p_id uuid, p_type text, p_name text, p_email text, p_company text, p_service text, p_message text)
RETURNS text LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE result text;
BEGIN
 IF p_id IS NULL OR p_type IS NULL OR p_type NOT IN ('service','quotation','partnership') OR p_name IS NULL OR char_length(trim(p_name)) NOT BETWEEN 1 AND 100 OR p_email IS NULL OR char_length(p_email) > 255 OR p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' OR p_company IS NULL OR char_length(p_company) > 150 OR p_service IS NULL OR char_length(p_service) NOT BETWEEN 1 AND 150 OR p_message IS NULL OR char_length(trim(p_message)) NOT BETWEEN 10 AND 3000 THEN
  RAISE EXCEPTION 'Please check your request details.';
 END IF;
 PERFORM pg_advisory_xact_lock(hashtextextended(lower(trim(p_email)), 0));
 SELECT reference INTO result FROM public.website_requests WHERE id = p_id AND email = lower(trim(p_email));
 IF result IS NOT NULL THEN RETURN result; END IF;
 IF (SELECT count(*) FROM public.website_requests WHERE email = lower(trim(p_email)) AND created_at > now() - interval '1 hour') >= 3 OR EXISTS (SELECT 1 FROM public.website_requests WHERE email = lower(trim(p_email)) AND created_at > now() - interval '30 seconds') THEN
  RAISE EXCEPTION 'Please wait before submitting another request.';
 END IF;
 result := 'IT-' || upper(replace(p_id::text, '-', ''));
 INSERT INTO public.website_requests(id, reference, request_type, name, email, company, service, message) VALUES (p_id, result, p_type, trim(p_name), lower(trim(p_email)), trim(p_company), p_service, trim(p_message));
 RETURN result;
END;
$$;
REVOKE ALL ON FUNCTION public.submit_website_request(uuid,text,text,text,text,text,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_website_request(uuid,text,text,text,text,text,text) TO anon, authenticated, service_role;