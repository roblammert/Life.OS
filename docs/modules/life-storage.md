# life-storage.md  
**Module Specification — Life.Storage (Spreadsheets & Data Workbooks)**  
*Part of the Life.OS Documentation Suite*

Life.Storage is the spreadsheet and structured‑data module of Life.OS. It provides workbook‑style data management similar to lightweight Excel or Google Sheets, but fully offline‑capable and deeply integrated with Life.Coach. Users can create sheets, enter data, use formulas, generate charts, and receive AI‑powered insights.

This document defines the purpose, data model, UI, workflows, backend endpoints, and intelligence integrations for Life.Storage.

---

## 1. Purpose and Responsibilities

Life.Storage is designed to be the user’s **structured data environment** — a place to track metrics, budgets, habits, logs, and any numeric or tabular information.

### Core Responsibilities
- Provide spreadsheet‑like workbooks with sheets, cells, formulas, and formatting.
- Store all data locally in IndexedDB for offline use.
- Sync workbook metadata and cell data to the backend when online.
- Support formulas, references, and basic calculations.
- Provide charting and visualization tools.
- Integrate with Life.Coach for:
  - Formula explanations  
  - Data insights  
  - Trend detection  
  - Correlations with journal, notes, and tasks  
- Contribute to Life Timeline and Life Graph.

### Role in the System
Life.Storage is the **quantitative backbone** of Life.OS.  
It supports:
- Habit tracking  
- Mood vs. behavior correlations  
- Budgeting and financial logs  
- Health metrics  
- Project tracking  
- Data‑driven insights  

---

## 2. Data Model (Conceptual)

Workbooks, sheets, and cells are stored locally in IndexedDB and synced to the backend.

### 2.1 Workbook

| Field | Type | Description |
|-------|------|-------------|
| `id` | string (UUID) | Unique identifier |
| `user_id` | string | Owner |
| `name` | string | Workbook name |
| `sheet_ids` | string[] | Sheets in workbook |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last modification |

### 2.2 Sheet

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `workbook_id` | string | Parent workbook |
| `name` | string | Sheet name |
| `cell_ids` | string[] | Cells in sheet |
| `created_at` | timestamp | Creation time |

### 2.3 Cell

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `sheet_id` | string | Parent sheet |
| `row` | number | Row index |
| `column` | number | Column index |
| `raw_value` | string | User‑entered value |
| `computed_value` | string | Evaluated result |
| `formula` | string | Optional formula |
| `format` | object | Formatting metadata |
| `updated_at` | timestamp | Last modification |

### 2.4 Chart

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique ID |
| `sheet_id` | string | Parent sheet |
| `type` | string | bar, line, pie, scatter |
| `range` | string | Cell range reference |
| `config` | object | Chart settings |

---

## 3. Frontend Architecture

Life.Storage provides a spreadsheet‑like UI optimized for touch and desktop.

### 3.1 UI Components

- **WorkbookList**  
  Displays all workbooks.

- **SheetTabs**  
  Switch between sheets.

- **GridView**  
  Spreadsheet grid with:
  - Cell selection  
  - Editing  
  - Formula bar  
  - Keyboard shortcuts  

- **FormulaBar**  
  Shows and edits formulas.

- **ChartPanel**  
  Displays charts and visualizations.

- **InsightPanel**  
  Powered by Life.Coach:
  - Formula explanations  
  - Trend detection  
  - Outlier detection  
  - Correlations with journal, notes, tasks  

- **GraphIntegration**  
  Numeric trends appear as nodes in the Life Graph.

### 3.2 Layout Behavior

#### Phone
- Simplified grid  
- Formula bar collapsible  
- Charts in slide‑up drawer  

#### Tablet
- Two‑pane layout  
- Grid + insights  

#### Desktop
- Full spreadsheet experience  
- Grid + formula bar + insights  

---

## 4. Workflows

### 4.1 Creating a Workbook
1. User clicks “New Workbook.”  
2. Workbook created with one default sheet.  
3. User adds sheets as needed.  
4. Sync queued if online.

### 4.2 Editing Cells
- User selects a cell and types.  
- Raw value stored.  
- Formula engine recalculates dependent cells.  
- Computed value displayed.  
- Life.Coach analyzes numeric patterns periodically.

### 4.3 Using Formulas
Supported formula types:
- Arithmetic: `=A1 + B1`  
- Aggregates: `SUM`, `AVG`, `MIN`, `MAX`  
- Comparisons: `IF`, `>` `<`  
- References: `A1`, `A1:B5`  

Life.Coach can:
- Explain formulas  
- Suggest corrections  
- Suggest alternative formulas  

### 4.4 Creating Charts
1. User selects a range.  
2. Chooses chart type.  
3. Chart saved to sheet.  
4. Insights generated (trends, anomalies).

### 4.5 Linking to Other Modules
Life.Coach suggests:
- Journal entries related to numeric trends  
- Tasks based on data patterns  
- Notes that should reference workbook data  

### 4.6 Importing Data
Supported formats:
- CSV  
- JSON  

### 4.7 Exporting Data
Supported formats:
- CSV  
- JSON  
- Chart images (future)  

---

## 5. Backend Endpoints

### Workbooks
- `GET /workbooks`  
- `POST /workbooks`  
- `PUT /workbooks/:id`  
- `DELETE /workbooks/:id`  

### Sheets
- `POST /workbooks/:id/sheets`  
- `PUT /sheets/:id`  
- `DELETE /sheets/:id`  

### Cells
- `PUT /cells/:id`  
- `POST /cells/batch`  

### Charts
- `POST /charts`  
- `PUT /charts/:id`  
- `DELETE /charts/:id`  

### Sync
- `POST /sync/push`  
- `POST /sync/pull`  

---

## 6. Integration with Life.Coach

Life.Storage is the quantitative input to Life.Coach’s data intelligence systems.

### 6.1 Analysis Performed
- Trend detection  
- Outlier detection  
- Correlation analysis  
- Habit consistency scoring  
- Forecasting (basic)  
- Formula explanation  

### 6.2 Insights Generated
- “Your sleep hours dropped this week.”  
- “Your mood improves on days with > 30 minutes of exercise.”  
- “This range contains outliers.”  
- “This formula may not do what you expect.”  

### 6.3 Contribution to Intelligence Systems
- Unified Life Graph — numeric nodes and relationships  
- Habit Intelligence — repeated numeric patterns  
- Emotional Insight Engine — mood ↔ numeric correlations  
- Productivity Intelligence — task performance ↔ metrics  
- Magic Features — Life Moments, memory consolidation  

---

## 7. IndexedDB Schema (Local)

Tables:
- `workbooks`  
- `sheets`  
- `cells`  
- `charts`  
- `sync_queue`  
- `embeddings`  
- `coach_insights`  
- `life_graph_nodes`  
- `life_graph_edges`  

Indexes:
- `updated_at`  
- `sheet_id`  
- `workbook_id`  

---

## 8. Error Handling

### Offline Mode
- All actions allowed  
- Sync queued  

### Sync Conflicts
- Last‑write‑wins  
- Future: cell‑level merge UI  

### Formula Errors
- Display `#ERROR`  
- Life.Coach suggests fixes  

---

## 9. Future Enhancements

- Pivot tables  
- Conditional formatting  
- Advanced formulas  
- AI‑generated charts  
- Workbook templates  
- Multi‑sheet references  
- Data validation rules  

---

## 10. Summary

Life.Storage is the structured data engine of Life.OS. It enables users to track, analyze, and visualize the quantitative aspects of their lives. Through deep integration with Life.Coach, it transforms raw numbers into meaningful insights and connects data across journal entries, notes, tasks, and habits.
