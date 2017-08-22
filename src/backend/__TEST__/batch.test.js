import createBatch from '../batch'

const mockDb = {
    createBatch: batch => {
        return true;
    },
    deleteBatch: batch => {
        return true;
    }
} 

test('Create batch', () => {
  const batch = createBatch(1, mockDb);
  expect(batch.ID).toBe(1);
  expect(batch)
  expect(batch.db).toBe(mockDb);
});