export const applyTableStyles = (tableElement: HTMLElement | null) => {
  if (!tableElement) return;

  // Add table styling classes
  tableElement.classList.add(
    'border-collapse',
    'w-full',
    'bg-white',
    'shadow-sm'
  );
  
  // Style table header
  const headerRow = tableElement.querySelector('thead tr');
  if (headerRow) {
    headerRow.classList.add(
      'bg-military-orange/20',
      'text-gray-900',
      'font-bold',
      'border-b-2',
      'border-military-orange'
    );
  }

  // Style table rows with alternating colors
  const bodyRows = tableElement.querySelectorAll('tbody tr');
  bodyRows.forEach((row, index) => {
    row.classList.add(
      'border-b',
      'border-military-orange/10',
      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
    );
  });

  // Style table cells
  const cells = tableElement.querySelectorAll('td, th');
  cells.forEach(cell => {
    cell.classList.add(
      'px-4',
      'py-3',
      'text-sm',
      'border-military-orange/10'
    );
  });

  // Add border to the entire table
  const table = tableElement.querySelector('table');
  if (table) {
    table.classList.add(
      'border-2',
      'border-military-orange/20',
      'rounded-lg'
    );
  }
};