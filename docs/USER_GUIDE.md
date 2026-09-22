# User guide / 使用指南

## Compose

Open `studio.html`, or run `npm start` and use the local address. Choose water, rain or canopy and a palette. Seed selects a repeatable arrangement. Density changes the number of marks; amplitude changes movement. For rain, duration controls vertical speed and amplitude controls lateral sway; zero amplitude freezes the entire scene.

播放默认关闭。点击「播放」开始，「暂停」停止；拖动时间轴可选择静帧。页面隐藏后会暂停，返回时不会自行恢复。导入新预设会暂停并回到起点。切换简体中文或英文不改变画面参数。

## Starter scenes and history / 场景与撤销

Choose Lake at rest, Rain in ink or Canopy at dusk to load an original project example. Loading stops playback and starts at zero. Undo restores the previous composition.

Undo/Redo retains up to 50 composition changes in this tab, including imports, resets and preset selection. Ctrl/Cmd+Z undoes; Shift+Ctrl/Cmd+Z redoes when focus is outside an editable field. Inside inputs, native text editing takes priority. History is not saved across reloads; the current composition is. Timeline position is not part of history. Sliders commit one history entry when a change is completed.

点击「湖面微光」「水墨细雨」「暮色树冠」即可开始。撤销和重做只恢复构图参数，不恢复播放时间；刷新会清空历史，但保留当前已保存构图。

## Save and exchange

“Save preset” downloads a small JSON file. It contains scene parameters and dimensions, not an image or timeline position. Import restores the composition at time zero. UI parameter changes are also saved locally when storage is available; browser settings can disable or clear this storage. Reset replaces the saved composition with the defaults.

Preset imports accept at most 8 KB and strictly validate values. If rejected, the existing composition stays intact. Custom dimensions in a valid imported preset appear in the format menu.

## Stills

Pause or scrub to a frame and export SVG or PNG. SVG preserves vector shapes and can be opened in compatible graphics software. PNG uses the browser canvas and exports the selected dimensions, independent of the on-screen preview size. Browser color rendering can vary. Filenames include scene and seed; browsers may append a suffix to repeated downloads.

## Offline loop

“Export loop HTML” creates an HTML file containing its own renderer and preset. Open it in a browser and press Play. It has no controls for modifying the composition; retain the JSON preset for editing. It is suitable for prototyping on a display but is not a hardened kiosk player. Escape exits browser fullscreen when available.

## Video workflow

There is no built-in MP4/WebM encoder. Use the supplied Node CLI:

```sh
npm run frames -- examples/lake.json output-frames 24
```

The example exports 288 SVG files, numbered `frame-00000.svg` through `frame-00287.svg`, plus `manifest.json`. The output directory must be new. Supported FPS is 1–60; duration × FPS must be integral.

Use an SVG-capable compositor or rasterizer to convert the frames to a PNG sequence, keeping filenames and selected dimensions, then import at **24 fps** into your video editor. Do not add the frame at 12 seconds: it repeats frame zero and creates a held frame at the seam. Exporting thousands of high-density SVGs can use substantial disk space. Test a short sequence first.

## Troubleshooting

- Local file blocked or download does nothing: try the local Node server and allow downloads for that local page.
- Slow on a phone or a large display: reduce density and resolution; use a rendered video for unattended playback.
- PNG unavailable: export SVG instead; support depends on the browser's SVG decoding/canvas APIs.
- Fullscreen unavailable: maximize the browser window. Mobile and embedded browsers vary.
- Nothing moves: playback is intentionally off initially; motion=0 intentionally freezes the scene.
- A preset errors: use the version-1 schema in `docs/API.md` and keep files under 8 KB.

## Before exhibiting

Review the work in the actual room, display, browser and lighting conditions. Test prolonged playback and allow viewers to opt out. The project makes no clinical, brain-network or attention-restoration claims.
