import { invoke } from '@tauri-apps/api';

let elements = [];

invoke('get_blocks')
  .then((res) => (elements = JSON.parse(res)))
  .catch((error) => {
    console.log(error);
  });

// TODO Replace this function with rust
export default function getAcceptedEdit(id) {
  const [targetElement] = elements.filter((el) => el.id === id);
  const target = targetElement.acceptEdit;
  if (target === undefined) return [];
  return target;
}
