CREATE OR REPLACE FUNCTION public.geodistance(a_lat numeric, a_lon numeric, b_lat numeric, b_lon numeric)
  RETURNS numeric AS
$BODY$
SELECT cast(asin(
  sqrt(
    sin(radians($3-$1)/2)^2 +
    sin(radians($4-$2)/2)^2 *
    cos(radians($1)) *
    cos(radians($3))
  )
) * 7926.3352 as numeric)  AS distance;
$BODY$
  LANGUAGE sql IMMUTABLE
  COST 100;