import { StyleSheet } from 'react-native';
import { scaleFont } from '../../utils/fontScale';

export const stylesIngressoModal = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
  },
  modalTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#000000',
    marginBottom: 10,
  },
  modalItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  modalItemText: {
    fontSize: scaleFont(14),
    fontWeight: '600',
    color: '#000000',
  },
  modalCancel: {
    marginTop: 12,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 10,
  },
  modalCancelText: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    color: '#800000',
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  successModalContainer: {
    width: '100%',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
  },
  successModalTitle: {
    fontSize: scaleFont(16),
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  successModalSubtitle: {
    fontSize: scaleFont(14),
    textAlign: 'center',
    color: '#000000',
  },
  successModalButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    borderRadius: 10,
  },
  successModalButtonText: {
    fontSize: scaleFont(14),
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
