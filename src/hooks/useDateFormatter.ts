import { supabase } from "@/integrations/supabase/client";

export const useDateFormatter = () => {
  const formatDate = async (date: string, direction: 'toFrontend' | 'toBackend') => {
    try {
      const { data, error } = await supabase.functions.invoke('format-dates', {
        body: { date, direction },
      });

      if (error) throw error;
      return data.formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return date; // Return original date if formatting fails
    }
  };

  const toFrontendFormat = (date: string) => formatDate(date, 'toFrontend');
  const toBackendFormat = (date: string) => formatDate(date, 'toBackend');

  return {
    toFrontendFormat,
    toBackendFormat,
  };
};