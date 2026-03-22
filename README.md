# FreeCAD Tree View Prototype

Hi!
There has been a lot of back and forth on how to build the ✨perfect✨ improved tree view for FreeCAD, so I thought we should realise some of these ideas into a prototype.

**FYI**: The prototype is _really_ ugly. The focus should be _user experience_ not looks. And if you break something, you are free to keep both pieces ;)

You can try it out yourself at: **MISSING LINK** or **LINK TO RUNNING IT LOCALLY**

Or, you can scroll through the ideas visualised informally below.

## Ideas

Ideas are written down below. Some are really big and have large implications while others are small but great quality-of-life changes.

---

---

**STRUCTURE OF EACH IDEA**

1. Problem
2. Idea
3. Functionality, how it works
4. Implications, effects

---

---

1. Small changes: 🐣
2. Medium changes: 🐤
3. Large changes: 🐦

(I swear this is not written with AI. I just find these emojies really funny. No, you grow up.)

### 🐦 What _Isn't_ Changing

- Off-the-bat
- Things intentionally not touched
- Fundamental document structure, sketch under feature, etc.
- ... (other things, can't remember?)
- Trying to make meaningful changes while only changing the minimum

### 🐦 From File- to Project-Based

- No longer tabs, bigger emphasis on the project as a whole, not a single file.
- Easier to navigate, scroll through and sort
- Reorder, pin, and add
- Flat files list, no hiearchy

### 🐦 No Active Body!

- No longer need to activate a body
- Hard to find, finicky to use
- Auto activated when file clicked on
- Means multiple bodies, assemblies, etc can't be in same document
- Want to find a way, just haven't found something _good_ yet

### 🐦 (Implicit) Workspaces

- A file has a certain type
- A type has certain workbenches allowed to be used
- Therefore implicit workspaces!
- Not really directly related with tree view, but still very close.

### 🐦 Viewing and Traversing the View

- Filters
- Or, Folders, or ...
- Still uncertain

### 🐤 Status of a Feature

- FreeCAD today: overlay icons
- Hard to read, hard to understand

### 🐤 Visual Tip

- AKA: Cursor, Dragger, etc.
- Drag and drop
- When out of view
- ...

### 🐤 Tasks, Properties and Tree View

- Moving properties (varset and just from feature) to tasks
- Tab-based in task pane

### 🐤 Moving a Feature

- Drag and drop
- Cut and paste

### 🐣 Renaming a Feature

- Edit one, then press tab to go to next
- Automagically change name if it follows certain style (**Drill-bit Fillet** instead of **Fillet003** if previous is **Drill-bit Pad**)

### 🐣 Visual Soft Breaks

- Easier for the eyes
- Visual anchors
- Small padding between features not directly linked

### 🐣 Surfacing Joints From Selection

- Assembly
- Selecting body will surface joint(s) from folder (temporary)
- Selecting joint will surface body(s) to top (temporary)

---

## Running it locally

Prerequisites:

- Node.js

After installing Node.js and getting the repository on your local computer, you can install dependencies with `npm install` and then start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```
