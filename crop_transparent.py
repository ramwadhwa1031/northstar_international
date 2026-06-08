import sys
try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def crop_transparent(img_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        # Get bounding box of non-transparent pixels
        bbox = img.getbbox()
        if bbox:
            cropped = img.crop(bbox)
            cropped.save(img_path)
            print(f"Cropped {img_path}")
        else:
            print(f"Image {img_path} is completely empty!")
    except Exception as e:
        print(f"Failed to crop {img_path}: {e}")

crop_transparent(r"C:\Users\DELL\Downloads\USAWEB\img\Banner_img.png")
crop_transparent(r"C:\Users\DELL\Downloads\USAWEB\img\banner-2.png")
