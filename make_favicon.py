from PIL import Image, ImageOps
import numpy as np
import sys

def process_image(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    data = np.array(img)
    
    # Calculate difference from white
    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
    
    # Brightness (white is 255)
    brightness = (r.astype(float) + g.astype(float) + b.astype(float)) / 3.0
    
    # Mask where it is NOT white. Let's say white is > 240
    # For a smoother edge, we map brightness 230 to 255 as alpha 255 to 0
    alpha = np.clip((255 - brightness) * (255.0 / (255.0 - 240.0)), 0, 255).astype(np.uint8)
    
    # Actually, the rug is brown/orange, which is much darker.
    # We want full alpha for the rug and 0 alpha for the white.
    # White background might be around 250+.
    mask = brightness < 240
    
    # To prevent white halos, any pixel that is very bright gets its alpha reduced.
    # We can also just set alpha to 0 for pixels > 245
    new_alpha = np.where(brightness > 240, 0, 255).astype(np.uint8)
    
    # Optional: a slightly softer edge
    # For pixels between 230 and 245
    soft_mask = (brightness >= 240) & (brightness <= 250)
    new_alpha[soft_mask] = np.clip(255 - (brightness[soft_mask] - 240) * (255/10), 0, 255).astype(np.uint8)
    
    data[:,:,3] = new_alpha
    
    out_img = Image.fromarray(data)
    
    # Crop to bounding box
    bbox = out_img.getbbox()
    if bbox:
        out_img = out_img.crop(bbox)
        
    # Make it square
    w, h = out_img.size
    size = max(w, h)
    
    # Create the dark background that matches the site #0a0604 
    # Or keep it transparent? The user has a dark background on their site.
    # Transparent is standard for favicons, but since they want it to look good on dark:
    # Let's make it fully transparent so it just floats.
    square = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    square.paste(out_img, ((size - w) // 2, (size - h) // 2))
    
    # Add some padding (10%)
    pad = int(size * 0.1)
    final_size = size + pad * 2
    final_square = Image.new('RGBA', (final_size, final_size), (0, 0, 0, 0))
    final_square.paste(square, (pad, pad))
    
    # Resize to 512x512
    final_square = final_square.resize((512, 512), Image.Resampling.LANCZOS)
    
    final_square.save(output_path, 'PNG')
    print("Saved to", output_path)

if __name__ == "__main__":
    process_image(sys.argv[1], sys.argv[2])
