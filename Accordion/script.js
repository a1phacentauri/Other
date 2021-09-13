// https://github.com/VoloshchenkoAl/accordion-modular-component

interface Subject {
    subscribe(observer: AccordionObserver): void;
    unsubscribe(observer: AccordionObserver): void;
    notify(): void;
}

class Accordion implements Subject {
    private observers: Set<AccordionObserver> = new Set<AccordionObserver>();

    public activeItem: string = '';

    subscribe(observer: AccordionObserver): void {
        const inObserverExists = this.observers.has(observer);

        if (inObserverExists) {
            return;
        }

        this.observers.add(observer);
    }

    unsubscribe(observer: AccordionObserver): void {
        const inObserverExists = this.observers.has(observer);

        if (inObserverExists) {
            return;
        }

        this.observers.delete(observer);
    }

    notify() {
        for (const observer of Array.from(this.observers)) {
            observer.update(this);
        }
    }

    updateActiveItem(activeItem: string): void {
        this.activeItem = this.activeItem === activeItem ? '' : activeItem;

        this.notify();
    }
}

abstract class AccordionObserver {
    abstract update(context: Accordion): void;

    static controlAttribute = 'data-accordion-control';

    static contentAttribute = 'data-accordion-content';

    public mainElement: HTMLElement = null;

    constructor(mainItem: string) {
        this.mainElement = document.querySelector(mainItem);
    }

    protected getActiveControl(activeItem: string): HTMLElement | null {
        if (!activeItem) {
            return null;
        }

        const activeControlSelector = `[${AccordionObserver.controlAttribute}=${activeItem}]`;

        return this.mainElement.querySelector(activeControlSelector);
    }

    protected getActiveContent(activeItem: string): HTMLElement | null {
        if (!activeItem) {
            return null;
        }

        const activeContentSelector = `[${AccordionObserver.contentAttribute}=${activeItem}]`;

        return this.mainElement.querySelector(activeContentSelector);
    }

    protected get controls(): HTMLElement[] {
        const controlsSelector = `[${AccordionObserver.controlAttribute}]`;

        return Array.from(this.mainElement.querySelectorAll(controlsSelector));
    }

    protected get contents(): HTMLElement[] {
        const contentsSelector = `[${AccordionObserver.contentAttribute}]`;

        return Array.from(this.mainElement.querySelectorAll(contentsSelector));
    }

    static addEventListener(mainItem: string, accordion: Accordion) {
        const mainElement = document.querySelector(mainItem);
        const controlsSelector = `[${AccordionObserver.controlAttribute}]`;
        const controls = mainElement.querySelectorAll(controlsSelector);

        Array.from(controls).forEach((control) => {
            control.addEventListener('click', (e: MouseEvent) => {
                const targetElement = e.target as HTMLElement;
                const controlValue = targetElement.getAttribute(
                    AccordionObserver.controlAttribute
                );

                if (!controlValue) {
                    return;
                }

                accordion.updateActiveItem(controlValue);
            });
        });
    }
}

class AccordionInterfaceObserver extends AccordionObserver {
    update(context: Accordion): void {
        this.updateInterface(context.activeItem);
    }

    private resetInterface() {
        this.contents.forEach((content) => {
            content.setAttribute('hidden', 'true');
            content.setAttribute('data-accordion-expanded', 'false');
        });

        this.controls.forEach((controls) => {
            controls.setAttribute('data-accordion-expanded', 'false');
        });
    }

    private updateInterface(activeItem: string): void {
        const activeContent = this.getActiveContent(activeItem);
        const activeControl = this.getActiveControl(activeItem);
        this.resetInterface();

        if (!activeContent) {
            return;
        }

        activeContent.removeAttribute('hidden');
        activeControl.setAttribute('data-accordion-expanded', 'true');
        activeContent.setAttribute('data-accordion-expanded', 'true');
    }
}

class AccordionAriaObserver extends AccordionObserver {
    constructor(mainItem: string) {
        super(mainItem);

        this.initAriaAttributes();
    }

    update(context: Accordion): void {
        this.updateAria(context.activeItem);
    }

    private initAriaAttributes(): void {
        this.controls.forEach((control) => {
            const controlValue = control.getAttribute('data-accordion-control');

            control.setAttribute('aria-expanded', 'false');
            control.setAttribute('aria-controls', controlValue);
        });

        this.contents.forEach((content) => {
            const contentValue = content.getAttribute('data-accordion-content');

            content.setAttribute('id', contentValue);
        });
    }

    private resetAria(): void {
        this.controls.forEach((control) => {
            control.setAttribute('aria-expanded', 'false');
        });
    }

    private updateAria(activeItem: string): void {
        const activeControl = this.getActiveControl(activeItem);
        this.resetAria();

        if (!activeControl) {
            return;
        }

        activeControl.setAttribute('aria-expanded', 'true');
    }
}

class AccordionAnimationObserver extends AccordionObserver {
    static CONTROLS_ANIMATION_ATTR: string = 'data-accordion-control-animation';
    static CONTENT_ANIMATION_ATTR: string = 'data-accordion-content-animation';

    prevContent: string;

    constructor(mainItem: string) {
        super(mainItem);
        this.prevContent = '';

        this.setControlAnimation();
        this.setContentAnimation();
    }

    update(context: Accordion): void {
        this.animate(context.activeItem);
    }

    private setControlAnimation(): void {
        this.controls.forEach((control) => {
            control.setAttribute(
                AccordionAnimationObserver.CONTROLS_ANIMATION_ATTR,
                'true'
            );
        });
    }

    private setContentAnimation(): void {
        this.contents.forEach((control) => {
            control.setAttribute(
                AccordionAnimationObserver.CONTENT_ANIMATION_ATTR,
                'false'
            );
        });
    }

    private animateActiveContent(activeItem: string): void {
        const activeContent = this.getActiveContent(activeItem);

        if (!activeContent) {
            return;
        }

        const animateToHeight = activeContent.offsetHeight;
        activeContent.style.height = '0px';

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
            activeContent.style.height = `${animateToHeight}px`;
            activeContent.setAttribute(
                AccordionAnimationObserver.CONTENT_ANIMATION_ATTR,
                'true'
            );
                  });
        });
    }

    private hidePreviousContent(): void {
        if (!this.prevContent) {
            return;
        }

        const activePrevContent = this.getActiveContent(this.prevContent);

        activePrevContent.removeAttribute('hidden');
        activePrevContent.style.height = '0px';
        activePrevContent.setAttribute(
            AccordionAnimationObserver.CONTENT_ANIMATION_ATTR,
            'false'
        );

        activePrevContent.addEventListener(
            'transitionend',
            function hidePrevContent() {
                activePrevContent.setAttribute('hidden', 'true');
                activePrevContent.style.height = '';
                activePrevContent.removeEventListener(
                    'transitionend',
                    hidePrevContent
                );
            }
        );
    }

    private animate(activeItem: string): void {
        this.hidePreviousContent();
        this.animateActiveContent(activeItem);

        this.prevContent = activeItem;
    }
}

const accordion = new Accordion();
const accordionInterfaceObserver = new AccordionInterfaceObserver(
    '.accordion-js'
);
const accordionAriaObserver = new AccordionAriaObserver('.accordion-js');
const accordionAnimationObserver = new AccordionAnimationObserver(
    '.accordion-js'
);

accordion.subscribe(accordionInterfaceObserver);
accordion.subscribe(accordionAriaObserver);
accordion.subscribe(accordionAnimationObserver);

AccordionObserver.addEventListener('.accordion-js', accordion);
