interface RichTextRendererProps {
  content: string;
  className?: string;
}

export default function RichTextRenderer({ content, className = '' }: RichTextRendererProps) {
  const renderRichText = (text: string) => {
    // Apply the same transformations as the RichTextEditor preview
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-amber-300 pl-4 italic text-gray-700 bg-amber-50 py-2 my-4 rounded-r">$1</blockquote>')
      .replace(/\n\n/g, '</p><p class="mb-6">')
      .replace(/\n/g, '<br />');
  };

  return (
    <div 
      className={`prose prose-lg max-w-none font-serif text-gray-800 leading-relaxed ${className}`}
      dangerouslySetInnerHTML={{ 
        __html: `<p class="mb-6 text-lg leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:text-amber-700 first-letter:float-left first-letter:mr-2 first-letter:mt-1">${renderRichText(content)}</p>`
      }}
    />
  );
}