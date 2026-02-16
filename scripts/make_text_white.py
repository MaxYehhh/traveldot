from PIL import Image
import sys

def make_text_white(input_path, output_path):
    try:
        img = Image.open(input_path)
        img = img.convert("RGBA")
        datas = img.getdata()
        
        newData = []
        for item in datas:
            r, g, b, a = item
            
            # If completely transparent, keep it
            if a == 0:
                newData.append(item)
                continue
                
            # Heuristic to identify the red pin
            # The pin is Coral Red/Orange, so Red > Blue and Red > Green significantly
            is_reddish = (r > g + 30) and (r > b + 30)
            
            if is_reddish:
                # Keep the red pin as is
                newData.append(item)
            else:
                # Change non-red pixels (the dark text) to white
                # Maintain original alpha for anti-aliasing smooth edges
                newData.append((255, 255, 255, a))
        
        img.putdata(newData)
        img.save(output_path, "PNG")
        print(f"Successfully created white text version at {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python make_text_white.py <input_path> <output_path>")
        sys.exit(1)
        
    make_text_white(sys.argv[1], sys.argv[2])
