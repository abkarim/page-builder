import { invoke } from '@tauri-apps/api';

let elements = [];

invoke('get_blocks')
  .then((res) => (elements = JSON.parse(res)))
  .catch((error) => {
    console.log(error);
  });

// TODO Replace this function with rust
export default function getAcceptedStyle(id) {
  const [targetElement] = elements.filter((el) => el.id === id);
  return targetElement.acceptStyle;
}
