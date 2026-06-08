import sys
try:
    from PIL import Image, ImageDraw
except ImportError:
    import subprocess
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image, ImageDraw

def flood_fill_transparent(img_path):
    try:
        img = Image.open(img_path).convert("RGBA")
        width, height = img.size
        
        # We will use flood fill to replace white background with transparent
        # Pillow's ImageDraw.floodfill replaces color at a point.
        # But we want to replace it with transparent.
        
        # Seed points: corners
        seeds = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
        
        # Target color to replace (white-ish)
        # We can't easily floodfill a range in Pillow directly.
        # Instead, let's write a custom BFS to floodfill all near-white pixels from corners
        
        pixels = img.load()
        visited = set()
        queue = []
        
        for r, c in seeds:
            pr, pg, pb, pa = pixels[r, c]
            if pa == 0: continue # Already transparent
            # Check if corner is light
            if pr > 240 and pg > 240 and pb > 240:
                queue.append((r, c))
                visited.add((r, c))
                
        # BFS
        while queue:
            x, y = queue.pop(0)
            pixels[x, y] = (255, 255, 255, 0)
            
            # Neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height:
                    if (nx, ny) not in visited:
                        pr, pg, pb, pa = pixels[nx, ny]
                        if pa != 0 and pr > 235 and pg > 235 and pb > 235: # Tolerance for JPEG artifacts
                            visited.add((nx, ny))
                            queue.append((nx, ny))
                            
        # Save over the original (or as PNG if it was JPEG)
        import os
        base, ext = os.path.splitext(img_path)
        output_path = base + ".png"
        img.save(output_path, "PNG")
        print(f"Successfully made background transparent for {output_path}")
        return output_path
    except Exception as e:
        print(f"Failed processing {img_path}: {e}")
        return None

print("Processing banners...")
banner1 = r"C:\Users\DELL\Downloads\USAWEB\img\Banner_img.png"
banner2 = r"C:\Users\DELL\Downloads\USAWEB\img\banner-2.jpeg"

flood_fill_transparent(banner1)
flood_fill_transparent(banner2)
