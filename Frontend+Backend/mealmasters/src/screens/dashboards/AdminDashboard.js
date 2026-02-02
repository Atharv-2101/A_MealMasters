import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function AdminDashboard(){

     return (
        <View style={styles.container}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage orders & menus</Text>
        </View>
      )
    }
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#FFF3E8',
        justifyContent: 'center',
        alignItems: 'center'
      },
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FF7A00'
      },
      subtitle: {
        marginTop: 8,
        fontSize: 16,
        color: '#555'}
      
})