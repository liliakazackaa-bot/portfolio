// Форма заявки: предвыбор услуги из CTA, валидация, отправка в Web3Forms, состояния.
import { validateForm, validateName, validateContact, validateTask, buildPayload, type FormValues } from './form-validate';

type Field = 'name' | 'contact' | 'service' | 'task' | 'consent';
const FAIL_TEXT = '× не удалось отправить. попробуйте ещё раз или напишите на email';

export function initForm(form: HTMLFormElement, endpoint = 'https://api.web3forms.com/submit'): void {
  form.noValidate = true;
  const key = form.dataset.key ?? '';
  const wrap = form.parentElement!;
  const success = wrap.querySelector<HTMLElement>('[data-form-success]');
  const status = wrap.querySelector<HTMLElement>('[data-form-status]');
  const failBox = form.querySelector<HTMLElement>('[data-form-error]');
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]');
  const agentPlace = form.querySelector<HTMLFieldSetElement>('[data-agent-place]');
  const task = form.querySelector<HTMLTextAreaElement>('#f-task');
  const count = form.querySelector<HTMLElement>('[data-count]');
  const submitText = submit?.textContent ?? '';
  let sending = false;

  const radio = (name: string) => form.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value ?? null;

  const values = (): FormValues => ({
    name: (form.elements.namedItem('name') as HTMLInputElement).value,
    contact: (form.elements.namedItem('contact') as HTMLInputElement).value,
    service: radio('service'),
    agentPlace: radio('agentPlace'),
    task: task?.value ?? '',
    budget: radio('budget'),
    consent: (form.elements.namedItem('consent') as HTMLInputElement).checked,
  });

  const target = (field: Field): HTMLElement | null =>
    ({
      name: form.querySelector<HTMLElement>('#f-name'),
      contact: form.querySelector<HTMLElement>('#f-contact'),
      service: form.querySelector<HTMLElement>('input[name="service"]'),
      task: task,
      consent: form.querySelector<HTMLElement>('input[name="consent"]'),
    })[field];

  const show = (field: Field, error: string | null) => {
    const box = form.querySelector<HTMLElement>(`#${field}-error`);
    if (box) box.textContent = error ?? '';
    const el = target(field);
    if (field === 'service') {
      form.querySelectorAll('input[name="service"]').forEach((r) =>
        error ? r.setAttribute('aria-invalid', 'true') : r.removeAttribute('aria-invalid'),
      );
    } else if (el) {
      error ? el.setAttribute('aria-invalid', 'true') : el.removeAttribute('aria-invalid');
    }
  };

  const syncAgentPlace = () => {
    if (!agentPlace) return;
    const isAgent = radio('service') === 'agent';
    agentPlace.hidden = !isAgent;
    if (!isAgent) agentPlace.querySelectorAll<HTMLInputElement>('input').forEach((i) => (i.checked = false));
  };

  // Предвыбор услуги из кнопок CTA.
  document.addEventListener('click', (e) => {
    const a = (e.target as Element).closest<HTMLAnchorElement>('a[data-service]');
    if (!a) return;
    const r = form.querySelector<HTMLInputElement>(`input[name="service"][value="${a.dataset.service}"]`);
    if (r) {
      r.checked = true;
      syncAgentPlace();
      show('service', null);
    }
  });

  form.addEventListener('change', (e) => {
    const t = e.target as HTMLInputElement;
    if (t.name === 'service') {
      syncAgentPlace();
      show('service', null);
    }
    if (t.name === 'consent' && t.checked) show('consent', null);
  });

  // Ошибки на уходе с поля.
  form.querySelector('#f-name')?.addEventListener('blur', (e) =>
    show('name', validateName((e.target as HTMLInputElement).value)),
  );
  form.querySelector('#f-contact')?.addEventListener('blur', (e) =>
    show('contact', validateContact((e.target as HTMLInputElement).value)),
  );
  task?.addEventListener('input', () => {
    if (count) count.textContent = `${task.value.length} / 1000`;
    show('task', validateTask(task.value));
  });

  const showSuccess = () => {
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus();
    }
    if (status) status.textContent = 'Заявка принята. Отвечу в течение дня.';
  };

  const setSending = (on: boolean) => {
    sending = on;
    if (!submit) return;
    submit.disabled = on;
    submit.textContent = on ? '[ отправляю… ]' : submitText;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (sending) return;
    if (failBox) failBox.textContent = '';

    const v = values();
    const errors = validateForm(v);
    const order: Field[] = ['name', 'contact', 'service', 'task', 'consent'];
    order.forEach((f) => show(f, errors[f]));
    const first = order.find((f) => errors[f]);
    if (first) {
      target(first)?.focus();
      return;
    }

    // Ловушка для ботов: заполненный скрытый чекбокс — делаем вид, что всё ок.
    const bot = form.querySelector<HTMLInputElement>('input[name="botcheck"]');
    const payload: Record<string, string | boolean> = buildPayload(v, key);
    payload.botcheck = bot?.checked ?? false;

    setSending(true);
    try {
      // Демо-режим (ключ Web3Forms — заглушка): ничего не отправляем, только показываем успех.
      if (form.dataset.demo === 'true') {
        await new Promise((r) => setTimeout(r, 700));
        showSuccess();
        return;
      }
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || json.success !== true) throw new Error(json.message ?? `HTTP ${res.status}`);
      showSuccess();
    } catch {
      if (failBox) failBox.textContent = FAIL_TEXT;
      setSending(false);
    }
  });
}
