import SimplePDFViewer from '@/components/SimplePDFViewer';

export default function MagazinePage() {
  return (
    <div className="h-screen">
      <SimplePDFViewer file="/Tony-ism Magazine.pdf" />
    </div>
  );
}