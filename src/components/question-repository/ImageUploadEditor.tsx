import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Trash2,
  FlipHorizontal,
  FlipVertical,
  Crop,
} from "lucide-react";

interface ImageUploadEditorProps {
  initialImage?: string | null;
  onImageChange?: (hasImage: boolean, imageData: string | null) => void;
}

const ImageUploadEditor = ({ initialImage = null, onImageChange }: ImageUploadEditorProps) => {
  const [image, setImage] = useState<string | null>(initialImage);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImage(initialImage);
  }, [initialImage]);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        onImageChange?.(true, result);
      };
      reader.readAsDataURL(file);
    },
    [onImageChange]
  );

  const handleRemove = useCallback(() => {
    setImage(null);
    setZoom(100);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    onImageChange?.(false, null);
  }, [onImageChange]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 10, 200)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 10, 30)), []);
  const handleRotate = useCallback(() => setRotation((r) => (r + 90) % 360), []);
  const handleFlipH = useCallback(() => setFlipH((f) => !f), []);
  const handleFlipV = useCallback(() => setFlipV((f) => !f), []);

  const imageTransform = `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1}) scale(${zoom / 100})`;

  if (!image) {
    return (
      <div className="space-y-3">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-border rounded-xl py-12 flex flex-col items-center gap-3 text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors cursor-pointer"
        >
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">Click to upload an image</p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG, GIF up to 10MB
            </p>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1 flex-wrap">
        {[
          { icon: ZoomIn, label: "Zoom in", onClick: handleZoomIn },
          { icon: ZoomOut, label: "Zoom out", onClick: handleZoomOut },
          { icon: RotateCw, label: "Rotate", onClick: handleRotate },
          { icon: FlipHorizontal, label: "Flip horizontal", onClick: handleFlipH },
          { icon: FlipVertical, label: "Flip vertical", onClick: handleFlipV },
          { icon: Crop, label: "Crop", onClick: () => {} },
        ].map(({ icon: Icon, label, onClick }) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-xs"
            onClick={onClick}
            title={label}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </Button>
        ))}

        <span className="text-xs text-muted-foreground ml-2 tabular-nums">
          {zoom}%
        </span>

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 gap-1.5 text-xs ml-auto text-destructive border-destructive/30 hover:bg-destructive/10"
          onClick={handleRemove}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-muted/20 flex items-center justify-center min-h-[200px] max-h-[360px]">
        <img
          src={image}
          alt="Uploaded"
          className="max-w-full max-h-[340px] object-contain transition-transform duration-200"
          style={{ transform: imageTransform }}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-3.5 h-3.5" />
        Replace Image
      </Button>
    </div>
  );
};

export default ImageUploadEditor;
