import os
import shutil
import subprocess

workspace_root = r"c:\Users\jainj\OneDrive\Desktop\jainzee website"
scratch_dir = r"C:\Users\jainj\.gemini\antigravity\brain\2f2835d8-be25-463d-b3af-fb35d79af60b\scratch\ai_studio_extracted\ai-studio-jainzee-main"

# Copy updated src files to scratch
src_src = os.path.join(workspace_root, "src")
scratch_src = os.path.join(scratch_dir, "src")
shutil.copytree(src_src, scratch_src, dirs_exist_ok=True)
print("Copied src to scratch")

# Copy .env to scratch
if os.path.exists(os.path.join(workspace_root, ".env")):
    shutil.copy2(os.path.join(workspace_root, ".env"), os.path.join(scratch_dir, ".env"))

# Run npm run build in scratch
res = subprocess.run(
    ["cmd.exe", "/c", "npm run build"],
    cwd=scratch_dir,
    capture_output=True,
    text=True
)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
if res.returncode != 0:
    print(f"Build failed with code {res.returncode}")
    exit(1)

# Now copy dist to workspace dist
dist_scratch = os.path.join(scratch_dir, "dist")
dist_ws = os.path.join(workspace_root, "dist")
shutil.copytree(dist_scratch, dist_ws, dirs_exist_ok=True)

# Also copy dist/assets to jainzee-website/static/assets
static_assets = os.path.join(workspace_root, "jainzee-website", "static", "assets")
os.makedirs(static_assets, exist_ok=True)
scratch_assets = os.path.join(dist_scratch, "assets")
for f in os.listdir(scratch_assets):
    shutil.copy2(os.path.join(scratch_assets, f), os.path.join(static_assets, f))

# Find the built js and css names
js_file = None
css_file = None
for f in os.listdir(scratch_assets):
    if f.endswith(".js"):
        js_file = f
    elif f.endswith(".css"):
        css_file = f

print(f"Built JS: {js_file}, CSS: {css_file}")

# Update jainzee-website/templates/index.html
tmpl_path = os.path.join(workspace_root, "jainzee-website", "templates", "index.html")
with open(tmpl_path, "r", encoding="utf-8") as f:
    tmpl = f.read()

import re
tmpl = re.sub(r'/static/assets/index-[a-zA-Z0-9_\-]+\.js', f'/static/assets/{js_file}', tmpl)
tmpl = re.sub(r'/static/assets/index-[a-zA-Z0-9_\-]+\.css', f'/static/assets/{css_file}', tmpl)

with open(tmpl_path, "w", encoding="utf-8") as f:
    f.write(tmpl)

print("Updated template index.html with new asset links.")
