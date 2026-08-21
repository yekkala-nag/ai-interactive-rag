// ============================================================================
// PANDAS DATAFRAMES ENHANCED ENGINE
// In-Memory Tabular Data Manipulation, Memory Profiling & Vectorization
// Responsible AI & Security Compliant: Zero PII / Zero Copyrighted Materials
// ============================================================================

export const DATA_STRUCTURES_COMPARISON = [
  {
    name: "Python List",
    type: "Built-in Object",
    mutability: "Mutable",
    homogeneity: "Heterogeneous (Stores int, str, float, bool)",
    syntax: 'my_list = [101, "item_alpha", 99.5, True]',
    vectorizedOps: "No (Element repetition / list concatenation)",
    bestFor: "General sequential storage of arbitrary objects"
  },
  {
    name: "NumPy Ndarray",
    type: "NumPy Engine",
    mutability: "Mutable (Fixed Shape)",
    homogeneity: "Homogeneous (Single dtype per array)",
    syntax: 'arr = np.array([10, 20, 30, 40, 50])',
    vectorizedOps: "Yes (e.g., arr * 2 -> [20, 40, 60, 80, 100])",
    bestFor: "High-performance linear algebra, N-dimensional tensors & matrix math"
  },
  {
    name: "Pandas DataFrame",
    type: "Pandas Columnar Engine",
    mutability: "Mutable (Size & Values)",
    homogeneity: "Heterogeneous columns (each column is a homogeneous Series)",
    syntax: "df = pd.DataFrame({'Record_ID': [1, 2], 'Val': [88.5, 92.0]})",
    vectorizedOps: "Yes (Columnar SIMD operations, relational joins & slicing)",
    bestFor: "2D In-memory tabular analysis, SQL-style filtering, aggregations & file I/O"
  }
];

export const ARRAY_DIMENSIONS_DATA = [
  {
    dim: "1D Array (Vector)",
    shape: "(5,)",
    code: "np.array([10, 20, 30, 40, 50])",
    analogy: "Single Series / Single Column of data values",
    vectorizedExample: "[10, 20, 30] * 2 = [20, 40, 60]"
  },
  {
    dim: "2D Array (Matrix)",
    shape: "(3, 2)",
    code: "np.array([[10, 40], [20, 50], [30, 60]])",
    analogy: "Grid of rows and columns (Tabular spreadsheet layout)",
    vectorizedExample: "Can be converted directly to pd.DataFrame(data)"
  },
  {
    dim: "3D Array (Tensor)",
    shape: "(2, 3, 2)",
    code: "np.array([[[10,40],[20,50]], [[30,60],[40,70]]])",
    analogy: "Stack of 2D matrices (Multi-spectral images, Deep Learning tensors)",
    vectorizedExample: "Triggers ValueError in pd.DataFrame constructor (2D max limit)"
  }
];

// Interactive DataFrame Operations Simulator
export const RUN_DATAFRAME_OPERATION = (opType = 'head', filterThreshold = 25) => {
  const baseData = [
    { id: 1, entity: "Node_ Alpha", metric_val: 18.5, category: "Tech", active: "True", memory_bytes: 128 },
    { id: 2, entity: "Node_Beta", metric_val: 29.2, category: "Finance", active: "True", memory_bytes: 128 },
    { id: 3, entity: "Node_Gamma", metric_val: 42.0, category: "Tech", active: "False", memory_bytes: 128 },
    { id: 4, entity: "Node_Delta", metric_val: 14.8, category: "Health", active: "True", memory_bytes: 128 },
    { id: 5, entity: "Node_Epsilon", metric_val: 38.6, category: "Finance", active: "True", memory_bytes: 128 },
    { id: 6, entity: "Node_Zeta", metric_val: 51.4, category: "Tech", active: "False", memory_bytes: 128 }
  ];

  if (opType === 'head') {
    return {
      title: "df.head(3)",
      description: "Returns the first 3 rows of the DataFrame.",
      code: "df.head(3)",
      columns: ["id", "entity", "metric_val", "category", "active"],
      rows: baseData.slice(0, 3)
    };
  } else if (opType === 'tail') {
    return {
      title: "df.tail(3)",
      description: "Returns the last 3 rows of the DataFrame.",
      code: "df.tail(3)",
      columns: ["id", "entity", "metric_val", "category", "active"],
      rows: baseData.slice(-3)
    };
  } else if (opType === 'filter') {
    const filtered = baseData.filter(d => d.metric_val > filterThreshold);
    return {
      title: `df[df['metric_val'] > ${filterThreshold}]`,
      description: `Filters rows where metric_val > ${filterThreshold}. (${filtered.length} matching rows)`,
      code: `df[df['metric_val'] > ${filterThreshold}]`,
      columns: ["id", "entity", "metric_val", "category", "active"],
      rows: filtered
    };
  } else if (opType === 'describe') {
    return {
      title: "df.describe()",
      description: "Computes summary statistics for numerical columns.",
      code: "df.describe()",
      columns: ["stat", "id", "metric_val"],
      rows: [
        { stat: "count", id: "6.0", metric_val: "6.0" },
        { stat: "mean", id: "3.5", metric_val: "32.42" },
        { stat: "std", id: "1.87", metric_val: "13.61" },
        { stat: "min", id: "1.0", metric_val: "14.8" },
        { stat: "25%", id: "2.25", metric_val: "21.18" },
        { stat: "50%", id: "3.5", metric_val: "33.9" },
        { stat: "75%", id: "4.75", metric_val: "41.15" },
        { stat: "max", id: "6.0", metric_val: "51.4" }
      ]
    };
  } else {
    // memory_usage
    return {
      title: "df.memory_usage(deep=True)",
      description: "Inspects memory allocation per column in bytes.",
      code: "df.memory_usage(deep=True)",
      columns: ["column_name", "dtype", "memory_bytes"],
      rows: [
        { column_name: "Index", dtype: "int64", memory_bytes: "128 B" },
        { column_name: "id", dtype: "int64", memory_bytes: "48 B" },
        { column_name: "entity", dtype: "object (string)", memory_bytes: "384 B" },
        { column_name: "metric_val", dtype: "float64", memory_bytes: "48 B" },
        { column_name: "category", dtype: "object (string)", memory_bytes: "360 B" },
        { column_name: "active", dtype: "bool", memory_bytes: "6 B" }
      ]
    };
  }
};

export const DATAFRAME_CONSTRUCTION_WORKFLOWS = [
  {
    id: "array",
    name: "1. From 2D NumPy Array",
    description: "Converts a 2D NumPy matrix into a labeled DataFrame with row indices and column names.",
    code: `import pandas as pd\nimport numpy as np\n\ndata = np.array([[10, 40], [20, 50], [30, 60]])\ndf = pd.DataFrame(data, index=['row1', 'row2', 'row3'], columns=['metric_a', 'metric_b'])\nprint(df)`
  },
  {
    id: "dict",
    name: "2. From Dictionary of Lists",
    description: "Constructs columnar Series where dictionary keys become column labels and list values become rows.",
    code: `import pandas as pd\n\ndict_data = {\n  'System_Node': ['Node_A', 'Node_B', 'Node_C'],\n  'Latency_ms': [12.4, 8.9, 15.1],\n  'Status': ['OK', 'OK', 'WARN']\n}\ndf = pd.DataFrame(dict_data)\nprint(df)`
  },
  {
    id: "row_dicts",
    name: "3. From List of Dictionaries",
    description: "Row-oriented creation where each list element is a record dictionary (ideal for API JSON payloads).",
    code: `import pandas as pd\n\nrecords = [\n  {'node': 'A', 'cpu_pct': 45.2, 'mem_gb': 16.0},\n  {'node': 'B', 'cpu_pct': 88.7, 'mem_gb': 32.0}\n]\ndf = pd.DataFrame(records)\nprint(df)`
  },
  {
    id: "csv",
    name: "4. From CSV Stream (pd.read_csv)",
    description: "Reads comma-separated files directly into in-memory DataFrames with automatic data type inference.",
    code: `import pandas as pd\n\n# Loading CSV file into DataFrame\ndf_metrics = pd.read_csv('system_metrics.csv')\nprint(df_metrics.head())`
  }
];

export const PYTHON_PANDAS_ADVANCED_CODE = `# ============================================================================
# ADVANCED PANDAS DATAFRAMES & IN-MEMORY METRICS (RESPONSIBLE AI COMPLIANT)
# ============================================================================

import numpy as np
import pandas as pd

# ── 1. Vectorized NumPy Interop ─────────────────────────────────────────────
raw_matrix = np.array([[15.2, 88.0], [22.4, 94.5], [31.0, 79.2]])
df_system = pd.DataFrame(raw_matrix, columns=['Latency_ms', 'Throughput_qps'])

# ── 2. Vectorized Column Transformation ─────────────────────────────────────
df_system['Normalized_Score'] = df_system['Throughput_qps'] / df_system['Latency_ms']

# ── 3. Relational Filtering & Indexing ──────────────────────────────────────
high_throughput = df_system[df_system['Throughput_qps'] > 85.0]

# ── 4. Memory Profiling ─────────────────────────────────────────────────────
memory_info = df_system.memory_usage(deep=True)

print("DataFrame Summary:")
print(df_system)
print("\\nFiltered High Throughput Nodes:")
print(high_throughput)
print("\\nMemory Usage (Bytes):")
print(memory_info)
`;
