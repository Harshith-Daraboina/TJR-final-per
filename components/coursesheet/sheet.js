import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../../supabaseConfig';

const Sheet = ({ course }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      if (!course) return;

      try {
        console.log(`Fetching data from table: ${course}`);
        
        const { data: tableData, error } = await supabase
          .from(course)
          .select('*');

        if (error) throw error;

        setData(tableData);

        if (tableData && tableData.length > 0) {
          setColumns(Object.keys(tableData[0]));
        }
      } catch (err) {
        console.error('Error fetching table data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTableData();
  }, [course]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading table data...</Text>
      </View>
    );
  }

  if (!data.length) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.noDataText}>No data available.</Text>
      </View>
    );
  }

  return (
    <ScrollView horizontal>
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          {columns.map((column, index) => (
            <View key={index} style={[styles.tableCell, styles.headerCell]}>
              <Text style={styles.headerText}>{column.replace(/_/g, ' ')}</Text>
            </View>
          ))}
        </View>

        {/* Table Rows */}
        <ScrollView style={styles.dataContainer}>
          {data.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {columns.map((column, colIndex) => (
                <View key={colIndex} style={styles.tableCell}>
                  <Text style={styles.cellText} numberOfLines={2} ellipsizeMode="tail">
                    {row[column] !== null ? String(row[column]) : 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: '100%',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    paddingVertical: 10,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  tableCell: {
    width: 120, // Fixed width for uniformity
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRightWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCell: {
    backgroundColor: '#007BFF',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  cellText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  dataContainer: {
    maxHeight: 400, // Prevents excessive scrolling
  },
});

export default Sheet;
