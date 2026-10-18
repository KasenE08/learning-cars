// Spec plate for reference-vehicle facts, with sources and honest status.
import { html } from '../dom.js';
import { fact } from '../../content/vehicles.js';

const STATUS = { confirmed: 'Confirmed', conflicting: 'Sources disagree', unconfirmed: 'Unconfirmed' };

export function factBlock(ids) {
  return html`<div class="facts">${ids.map((id) => {
    const f = fact(id);
    return html`<div class="fact fact--${f.status}">
      <span class="fact__k mono">${id.split('.')[1].replace(/([A-Z])/g, ' $1')}</span>
      <span class="fact__v">${f.value}</span>
      ${f.note ? html`<span class="fact__note">${f.note}</span>` : ''}
      <span class="fact__src mono"><b>${STATUS[f.status]}</b> · Source: ${f.sources.join('; ')}</span>
    </div>`;
  })}</div>`;
}
