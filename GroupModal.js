import React from 'react';
import { Modal, StyleSheet, SafeAreaView, Text, TouchableHighlight } from 'react-native';

const GroupModal = ({ visible, onClose }) => {
  return (
    <Modal visible={visible} animationType='slide'>
      <SafeAreaView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Group</Text>
        <TouchableHighlight style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableHighlight>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalInnerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    marginVertical: 10,
  },
})

export default GroupModal;
