import { serve } from "https://deno.land/std@0.177.0/http/server.ts"
import { format, parse } from "npm:date-fns@2.30.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { date, direction } = await req.json()
    let formattedDate: string

    if (direction === 'toFrontend') {
      // Convert YYYY-MM-DD to DD/MM/YYYY
      const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
      formattedDate = format(parsedDate, 'dd/MM/yyyy')
    } else {
      // Convert DD/MM/YYYY to YYYY-MM-DD
      const parsedDate = parse(date, 'dd/MM/yyyy', new Date())
      formattedDate = format(parsedDate, 'yyyy-MM-dd')
    }

    return new Response(
      JSON.stringify({ formattedDate }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error formatting date:', error)
    return new Response(
      JSON.stringify({ error: 'Error formatting date', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})