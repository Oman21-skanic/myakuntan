import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({
  duration: 3000,
  position: { x: 'right', y: 'top' },
  types: [
    {
      type: 'edit',
      background: '#FFC107', // Kuning
      icon: { className: 'fas fa-edit', tagName: 'i', color: '#fff' }
    },
    {
      type: 'delete', 
      background: '#F44336', // Merah
      icon: { className: 'fas fa-trash', tagName: 'i', color: '#fff' }
    }
  ]
});

export default notyf;