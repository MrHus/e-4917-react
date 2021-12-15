import { act } from 'react-dom/test-utils';

test('startup', async () => {
  expect.assertions(1);

  const root = document.createElement('div');
  root.id = 'root';

  document.body.append(root);

  await act(async () => {
    await import('./index');
  });

  const fantasyCpu = document.querySelector('.FantasyCpu');
  expect(fantasyCpu).toBeInstanceOf(HTMLDivElement);
});
