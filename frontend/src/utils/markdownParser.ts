// A lightweight markdown to HTML parser

// Function to escape HTML special characters to prevent XSS
const escapeHTML = (text: string): string => {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// Function to unescape code blocks since we want to preserve their formatting
const unescapeCodeBlocks = (html: string): string => {
  return html.replace(/&lt;code&gt;([\s\S]*?)&lt;\/code&gt;/g, '<code>$1</code>');
};

// Parse markdown to HTML using regex
export const parseMarkdown = (markdown: string): string => {
  if (!markdown) return '';
  
  // Pre-processing: Normalize line endings and remove excessive blank lines
  let cleanMarkdown = markdown
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{3,}/g, '\n\n') // Replace 3+ consecutive newlines with just 2
    .trim(); // Remove leading/trailing whitespace
  
  // Step 1: Escape HTML to prevent XSS
  let html = escapeHTML(cleanMarkdown);
  
  // Step 2: Code blocks (```code```)
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, language, code) => {
    const languageClass = language ? ` class="language-${language}"` : '';
    const languageLabel = language ? `<div class="code-language-tag">${language}</div>` : '';
    return `<div class="relative my-2">
              ${languageLabel}
              <div class="copy-code-button" data-copy="${escapeHTML(code.trim())}">Copy</div>
              <pre class="p-3 pb-2 pt-4 rounded-md bg-gray-900 text-gray-100 overflow-x-auto text-sm font-mono">
                <code${languageClass}>${escapeHTML(code.trim())}</code>
              </pre>
            </div>`;
  });
  
  // Step 3: Inline code (`code`)
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>');
  
  // Step 4: Headers (# Header)
  html = html.replace(/^# (.*$)/gm, '<h1 class="text-xl font-bold mt-4 mb-2 text-lawxpert-navy dark:text-lawxpert-gold">$1</h1>');
  html = html.replace(/^## (.*$)/gm, '<h2 class="text-lg font-bold mt-3 mb-2 text-lawxpert-navy dark:text-lawxpert-gold">$1</h2>');
  html = html.replace(/^### (.*$)/gm, '<h3 class="text-md font-bold mt-3 mb-1 text-lawxpert-navy dark:text-lawxpert-gold">$1</h3>');
  html = html.replace(/^#### (.*$)/gm, '<h4 class="text-base font-semibold mt-2 mb-1">$1</h4>');
  html = html.replace(/^##### (.*$)/gm, '<h5 class="text-sm font-semibold mt-2 mb-1">$1</h5>');
  html = html.replace(/^###### (.*$)/gm, '<h6 class="text-xs font-semibold mt-1 mb-1">$1</h6>');
  
  // Step 5: Bold and italic (**bold** and *italic*)
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold">$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em class="italic">$1</em>');
  
  // Step 6: Links ([text](url))
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');
  
  // Step 7: Images (![alt](url))
  html = html.replace(/!\[([^\]]+)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded my-2" />');
  
  // Step 8: Blockquotes (> quote)
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-3 py-0.5 my-2 italic text-gray-600 dark:text-gray-300">$1</blockquote>');
  
  // Step 9: Unordered lists (- item)
  html = html.replace(/^\s*[-*+]\s+(.+)$/gm, (match, item) => {
    return `<li class="mb-0.5">${item}</li>`;
  });
  
  // Wrap unordered list items in <ul>
  html = html.replace(/(<li class="mb-0.5">[^<]+<\/li>)+/g, '<ul class="list-disc pl-4 mb-2 space-y-0.5">$&</ul>');
  
  // Step 10: Ordered lists (1. item)
  html = html.replace(/^\s*(\d+)\.\s+(.+)$/gm, (match, number, item) => {
    return `<li class="mb-0.5">${item}</li>`;
  });
  
  // Wrap ordered list items in <ol>
  html = html.replace(/(<li class="mb-0.5">[^<]+<\/li>)+/g, match => {
    if (match.indexOf('<ul') === -1) {
      return `<ol class="list-decimal pl-4 mb-2 space-y-0.5">${match}</ol>`;
    }
    return match;
  });
  
  // Step 11: Horizontal rule (---)
  html = html.replace(/^---+$/gm, '<hr class="my-2 border-t border-gray-300 dark:border-gray-700">');
  
  // Step 12: Tables
  // For simplicity, we'll support a basic table format: | Column1 | Column2 | with headers separated by | --- | --- |
  const tableRegex = /\|(.+)\|\n\|([\s-:]+)\|\n((?:\|.+\|\n?)+)/g;
  html = html.replace(tableRegex, (match, headerRow, separatorRow, bodyRows) => {
    const headers = headerRow.split('|').map(header => header.trim()).filter(Boolean);
    const headerHTML = headers.map(header => `<th class="border border-gray-300 dark:border-gray-700 px-2 py-1 text-left font-medium">${header}</th>`).join('');
    
    const bodyHTML = bodyRows
      .trim()
      .split('\n')
      .map(row => {
        const cells = row.split('|').map(cell => cell.trim()).filter(Boolean);
        return `<tr class="hover:bg-gray-50 dark:hover:bg-gray-900">${cells.map(cell => `<td class="border border-gray-300 dark:border-gray-700 px-2 py-1">${cell}</td>`).join('')}</tr>`;
      })
      .join('');
    
    return `<div class="overflow-x-auto my-2">
              <table class="min-w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead class="bg-gray-100 dark:bg-gray-800">
                  <tr>${headerHTML}</tr>
                </thead>
                <tbody class="divide-y divide-gray-300 dark:divide-gray-700">
                  ${bodyHTML}
                </tbody>
              </table>
            </div>`;
  });
  
  // Step 13: Paragraphs (any other text)
  // More efficient paragraph handling to eliminate excessive spacing
  const processedParagraphs = [];
  const paragraphs = html.split(/\n\n+/);
  
  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i].trim();
    
    // Skip empty paragraphs
    if (paragraph === '') continue;
    
    // Skip if it's already a formatted element
    if (paragraph.startsWith('<')) {
      processedParagraphs.push(paragraph);
      continue;
    }
    
    // Handle line breaks within paragraphs - avoid empty lines
    const lines = paragraph.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) continue;
    
    // Join with <br> but only if there are multiple lines
    const content = lines.length > 1 ? lines.join('<br>') : lines[0];
    processedParagraphs.push(`<p class="mb-2 leading-relaxed">${content}</p>`);
  }
  
  // Join all processed paragraphs with no extra space
  html = processedParagraphs.join('');
  
  // Replace any multiple <br> tags with a single one
  html = html.replace(/<br><br>/g, '<br>');
  
  return html;
};

// Add a function to add click event listeners to copy buttons
export const attachCopyButtonListeners = (container: HTMLElement): void => {
  const copyButtons = container.querySelectorAll('.copy-code-button');
  copyButtons.forEach(button => {
    if (button instanceof HTMLElement) {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const codeToCopy = button.getAttribute('data-copy') || '';
        navigator.clipboard.writeText(codeToCopy);
        
        // Provide visual feedback
        const originalText = button.innerText;
        button.innerText = 'Copied!';
        button.style.backgroundColor = '#10b981'; // green
        
        setTimeout(() => {
          button.innerText = originalText;
          button.style.backgroundColor = '';
        }, 2000);
      });
    }
  });
}; 