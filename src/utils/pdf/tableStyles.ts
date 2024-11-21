export const applyTableStyles = (tableElement: HTMLElement | null) => {
  if (!tableElement) return;

  // Add table styling classes
  tableElement.classList.add(
    'border-collapse',
    'w-full',
    'bg-white',
    'shadow-sm'
  );
  
  // Style table rows
  const rows = tableElement.querySelectorAll('tr');
  rows.forEach((row, index) => {
    if (index === 0) {
      row.classList.add(
        'bg-military-orange/20',
        'text-gray-800',
        'font-semibold'
      );
    } else {
      row.classList.add(
        index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
        'border-b',
        'border-military-orange/20'
      );
    }
  });

  // Style table cells
  const cells = tableElement.querySelectorAll('td, th');
  cells.forEach(cell => {
    cell.classList.add(
      'px-4',
      'py-2',
      'text-sm',
      'border-military-orange/10'
    );
  });
};