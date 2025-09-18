import ImageListItem from './image-list-item';
import type { ConvertedFile } from '@/app/types/image';

interface ImageListProps {
  files: ConvertedFile[];
  onRemove: (id: string) => void;
}

const ImageList = ({ files, onRemove }: ImageListProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {files.map(file => (
        <ImageListItem key={file.id} file={file} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ImageList;
