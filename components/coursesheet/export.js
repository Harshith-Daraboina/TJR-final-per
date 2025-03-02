import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../supabaseConfig';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';

export default function Export({ course }) {
  const [data, setData] = useState([]);
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
        if (tableData.length > 0) {
          setColumns(Object.keys(tableData[0]));
        }
      } catch (err) {
        console.error('Error fetching table data:', err.message);
      }
    };

    fetchTableData();
  }, [course]);

  // Convert data to CSV format
  const generateCSV = () => {
    if (data.length === 0) {
      Alert.alert('No Data', 'No data available to export.');
      return null;
    }

    // Create CSV header
    const csvHeader = columns.join(',') + '\n';

    // Create CSV rows
    const csvRows = data.map(row =>
      columns.map(col => `"${row[col] || ''}"`).join(',')
    ).join('\n');

    return csvHeader + csvRows;
  };

  // Export CSV without saving
  const exportToCSV = async () => {
    const csvData = generateCSV();
    if (!csvData) return;

    try {
      // Create a temporary file
      const fileUri = FileSystem.cacheDirectory + `${course}_data.csv`;

      // Write CSV data to the file
      await FileSystem.writeAsStringAsync(fileUri, csvData, { encoding: FileSystem.EncodingType.UTF8 });

      // Check if sharing is available
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Share CSV File' });
      } else {
        Alert.alert('Sharing not available', 'Your device does not support file sharing.');
      }
    } catch (error) {
      console.error('Error exporting CSV:', error);
      Alert.alert('Export Failed', 'An error occurred while exporting the data.');
    }
  };

  return (
    <View style={{ alignItems: 'center', margin: 20 }}>
      <TouchableOpacity onPress={exportToCSV} style={styles.button}>
        <Text style={styles.buttonText}>Export CSV</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};
