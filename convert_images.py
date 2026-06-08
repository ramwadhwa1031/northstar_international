import os
import sys

try:
    from PIL import Image
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def process_image(img_path, output_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            r, g, b, a = item
            # Target both white and the light grey used in fake checkerboards
            # Condition: light color (RGB > 200) and low saturation (max-min < 30)
            if r > 190 and g > 190 and b > 190 and (max(r, g, b) - min(r, g, b)) < 30:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
                
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Fixed checkerboard for: {os.path.basename(output_path)}")
    except Exception as e:
        print(f"Failed to process {img_path}: {e}")

brands_dir = r"C:\Users\DELL\Downloads\USAWEB\img\brands"

print("Starting deep checkerboard removal...")
for filename in os.listdir(brands_dir):
    # Process original jpegs to avoid re-processing pngs which might degrade
    if filename.lower().endswith(('.jpeg', '.jpg')):
        img_path = os.path.join(brands_dir, filename)
        output_filename = os.path.splitext(filename)[0] + '.png'
        output_path = os.path.join(brands_dir, output_filename)
        process_image(img_path, output_path)

print("Finished fixing images!")
