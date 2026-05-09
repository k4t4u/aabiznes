import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
} from 'react-native';

type EntityCardProps = {
  title?: string;
  lines: string[];
  onEdit?: () => void;
  onDelete?: () => void;
};

const EntityCard: React.FC<EntityCardProps> = ({
  title,
  lines,
  onEdit,
  onDelete,
}) => {
  return (
    <View style={styles.card}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      {lines.map((line, index) => (
        <Text key={index} style={styles.text}>
          {line}
        </Text>
      ))}

      {(onEdit || onDelete) ? (
        <View style={styles.actionsRow}>
          {onEdit ? (
            <Pressable style={styles.editButton} onPress={onEdit}>
              <Text style={styles.editButtonText}>Edytuj</Text>
            </Pressable>
          ) : null}

          {onDelete ? (
            <Pressable style={styles.deleteButton} onPress={onDelete}>
              <Text style={styles.deleteButtonText}>Usuń</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: '#44546A',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },
  editButton: {
    borderWidth: 1.5,
    borderColor: '#2E6BE6',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  editButtonText: {
    color: '#2E6BE6',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: '#D62828',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

export default EntityCard;
