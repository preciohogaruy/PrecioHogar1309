import ImageConverterContainer from '@/components/imagen/ImageConverterContainer';
import ImageConverterHeader from '@/components/imagen/ImageConverterHeader';

export default function ImagenPage() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-5xl space-y-8 py-8">
        <ImageConverterHeader />
        <ImageConverterContainer />
      </div>
    </div>
  );
}
