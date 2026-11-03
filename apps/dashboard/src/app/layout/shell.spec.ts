import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { AnalyticsApi } from '../core/api/analytics-api';
import { MOCK_PROJECTS } from '../core/api/mock-data';
import { Shell } from './shell';

describe('Shell', () => {
  async function setup() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AnalyticsApi, useValue: { getProjects: () => of(MOCK_PROJECTS) } },
      ],
    });
    const fixture = TestBed.createComponent(Shell);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    const query = <T extends HTMLElement>(selector: string) => {
      const found = element.querySelector<T>(selector);
      if (!found) throw new Error(`${selector} not rendered`);
      return found;
    };
    return { fixture, query };
  }

  afterEach(() => document.body.replaceChildren());

  it('opens the mobile drawer, moves focus into it and makes the page inert', async () => {
    const { fixture, query } = await setup();
    const menuButton = query<HTMLButtonElement>('[aria-controls="app-sidebar"]');

    menuButton.click();
    await fixture.whenStable();

    expect(menuButton.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement?.getAttribute('aria-label')).toBe('Close navigation');
    expect(query('main').closest('[inert]')).not.toBeNull();
  });

  it('closes on Escape and returns focus to the menu button', async () => {
    const { fixture, query } = await setup();
    const menuButton = query<HTMLButtonElement>('[aria-controls="app-sidebar"]');
    menuButton.click();
    await fixture.whenStable();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await fixture.whenStable();

    expect(menuButton.getAttribute('aria-expanded')).toBe('false');
    expect(query('aside').classList).toContain('invisible');
    expect(document.activeElement).toBe(menuButton);
  });
});
