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
        'bg-gray-100',
        'text-black',
        'font-bold'
      );
    } else {
      row.classList.add(
        'border-b',
        'border-gray-300'
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
      'border',
      'border-gray-300'
    );
  });
};