# Memorial 3D Models

This directory contains 3D models for the AR memorial experience.

## Required Models

The AR system expects the following GLB files:

### Memorial Gate Models
- `memorial-gate-male.glb` - Memorial gate design for male memorials
- `memorial-gate-female.glb` - Memorial gate design for female memorials  
- `memorial-gate-child.glb` - Memorial gate design for child memorials
- `memorial-gate.glb` - Default memorial gate design

### Model Specifications

All models should:
- Be in GLB format (binary glTF)
- Have a maximum file size of 5MB
- Be optimized for mobile AR viewing
- Include proper materials and textures
- Have a scale appropriate for AR placement (approximately 1-2 meters tall)
- Include proper lighting and shadow support

### Textures

Models can include:
- Diffuse/Albedo textures
- Normal maps for detail
- Metallic/Roughness maps for realistic materials
- Emissive textures for glowing effects

### Memorial Gate Design Features

Each memorial gate should include:
- Two pillars or columns
- An arch or connecting top piece
- A central area for displaying the memorial photo
- Decorative elements appropriate to the memorial type
- Islamic architectural influences where appropriate
- Golden/bronze color scheme with accent colors

### Creating Models

You can create these models using:
- Blender (free, open source)
- Maya or 3ds Max (professional)
- SketchUp (easier for architectural models)
- Online tools like Tinkercad (simple models)

### Optimization Tips

- Use texture atlases to reduce draw calls
- Keep polygon count under 10,000 triangles
- Use LOD (Level of Detail) if possible
- Compress textures appropriately
- Test on mobile devices

### Fallback

If specific models are not available, the system will fall back to:
1. The default `memorial-gate.glb`
2. A procedurally generated 3D memorial using Three.js primitives
3. The Islamic arch placeholder image

## Installation

Place the GLB files directly in this directory. The AR system will automatically detect and use them.
