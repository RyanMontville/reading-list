import { animation, style, animate, keyframes, AnimationReferenceMetadata } from '@angular/animations';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationsService {

  constructor() { }
}

export const slideInFromLeft: AnimationReferenceMetadata = animation([
  style({
    visibility: 'hidden'
  }),
  animate('{{ duration }} {{ delay }}', keyframes([
    style({
      visibility: 'visible',
      opacity: 0,
      transform: 'translate3d(0, {{ distance }}, 0)',
      easing: 'ease',
      offset: 0
    }),
    style({
      opacity: 1,
      transform: 'translate3d(0, 0, 0)',
      easing: 'ease',
      offset: 1
    })
  ]))
], {
  params: {
    duration: '1s',
    delay: '300ms',
    distance: '25%'
  }
});

export const fadeOutUpAnimation: AnimationReferenceMetadata = animation([
  animate('{{ duration }} {{ delay }}', keyframes([
    style({
      opacity: 1,
      transform: 'translateY(0)',
      easing: 'ease',
      offset: 0
    }),
    style({
      opacity: 0,
      transform: 'translateY(-200%)', // Move upwards
      easing: 'ease',
      offset: 1,
      visibility: 'hidden' // Hide at the end
    })
  ]))
], {
  params: {
    duration: '0.3s',
    delay: '0ms',
    distance: '25%' // Not used in keyframes, but kept for consistency
  }
});