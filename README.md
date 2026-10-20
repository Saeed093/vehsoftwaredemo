# Revo Academy — Hilux Revo Interactive Trainer

A learning demo for the Toyota Hilux Revo double cabin. Lesson cards sit on the left: 7 system lessons and 6 fault lessons. On the right is a large 3D model with floating notes. Each lesson moves the camera to the real component, highlights it in X-ray, walks through the steps and ends with a quiz. Course progress is saved in the browser.

## Run / deploy
```bash
npm install
npm run dev          # http://localhost:5173
```
To deploy on Vercel, push the folder to GitHub, then **Add New → Project** and import the repo. Vercel detects Vite automatically.

## Using your CAD model
1. **Convert to GLB.** The viewer loads glTF binary (`.glb`).
   - STEP/IGES: open in FreeCAD or Blender (with a CAD importer add-on), then **Export → glTF 2.0 (.glb)**.
   - SolidWorks/Fusion: export OBJ/FBX, open in Blender, then export GLB.
   - Large CAD files: in Blender, add a **Decimate** modifier and enable **Draco compression** on export. Aim for under 30 MB.
2. **Try it instantly.** Drag the `.glb` onto the 3D view, or click **Load CAD model**.
   - **Z-up** fixes a model lying on its side.
   - **↻** turns it 90° until the front points to the right.
3. **Map the parts.** Click **Inspect**, then click a component to see its mesh name. Add that name to `PART_MAP` in `src/lessons.js`. For example, `radiator: ['Radiator_Core']` makes every cooling lesson highlight that mesh.
4. **Make it permanent.** Save the file as `public/models/revo.glb`; the app loads it automatically. Put the orientation fix in `MODEL.rotation` (e.g. `[-Math.PI / 2, 0, 0]` for Z-up).

Naming parts in Blender before export (Engine, Turbo, Radiator, Battery, DPF…) makes mapping almost automatic.

## Editing lessons
All content is in `src/lessons.js`. Each step looks like this:
```js
{ focus: ['turbo'], also: ['engine'], title: 'Variable-nozzle turbo', text: '…', tip: 'optional' }
```
`focus` glows and gets the camera, `also` stays solid for context, and everything else goes see-through. Fault lessons use `label: 'Symptom' | 'Cause' | 'Diagnose' | 'Fix' | 'Prevent'`. Camera angles per part are in `PARTS` (`dir` and `dist`).

> Content is compiled from public sources for demo purposes. Verify it against the Toyota Indus workshop manual before using it as official training material.
