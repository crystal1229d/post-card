import { LetterFormSteps } from '../constants/form'
import {
  SelectableImageColor,
  SelectableKeyword,
  SelectableLetterColor,
  SelectablePaperColor,
  SelectableStyle,
} from '../constants/letter'
import { create } from 'zustand'

interface LetterFormState {
  letterFormStep: number

  from: string
  to: string
  message: string
  image: string
  paperColor: string
  letterColor: string

  imageKeyword: string
  imageColor: string
  imageStyle: string
  imageDescription: string
}

const initialLetterFormState = {
  letterFormStep: 1 as LetterFormSteps,

  from: '',
  to: '',
  message: '',
  image: '',
  paperColor: 'white' as SelectablePaperColor,
  letterColor: 'black' as SelectableLetterColor,

  imageKeyword: 'Christmas' as SelectableKeyword,
  imageColor: 'red' as SelectableImageColor,
  imageStyle: 'Water Color' as SelectableStyle,
  imageDescription: '',
}

export interface LetterFormActions extends LetterFormState {
  setLetterFormStep: (letterFormStep: number) => void

  setFrom: (from: string) => void
  setTo: (to: string) => void
  setMessage: (message: string) => void
  setImage: (message: string) => void
  setPaperColor: (paperColor: string) => void
  setLetterColor: (letterColor: string) => void

  setImageKeyword: (imageKeyword: string) => void
  setImageColor: (imageColor: string) => void
  setImageStyle: (imageStyle: string) => void
  resetLetter: () => void
  setImageDescription: (imageDescription: string) => void
  generateAIImage: () => void
}

const useLetterFormStore = create<LetterFormState & LetterFormActions>(
  (set, get) => ({
    ...initialLetterFormState,
    setLetterFormStep: (letterFormStep) => set({ letterFormStep }),

    setFrom: (from) => set({ from }),
    setTo: (to) => set({ to }),
    setMessage: (message) => set({ message }),
    setImage: (image) => set({ image }),
    setPaperColor: (paperColor) => set({ paperColor }),
    setLetterColor: (letterColor) => set({ letterColor }),

    setImageKeyword: (imageKeyword) => set({ imageKeyword }),
    setImageColor: (imageColor) => set({ imageColor }),
    setImageStyle: (imageStyle) => set({ imageStyle }),
    setImageDescription: (imageDescription) => set({ imageDescription }),
    resetLetter: () => {
      set(initialLetterFormState)
    },
    generateAIImage: async () => {
      set({ letterFormStep: 5 })
      try {
        const response = await fetch('/api/letter/create-image', {
          method: 'POST',
          body: JSON.stringify({
            keyword: get().imageKeyword,
            color: get().imageColor,
            style: get().imageStyle,
            additionalDescription: get().imageDescription,
          }),
        })
        const res = await response.json()
        if (res.images.length > 0) set({ image: res.images[0].image })
      } catch (e) {
        console.log(e)
      } finally {
        set({ letterFormStep: 6 })
      }
    },
  }),
)

export default useLetterFormStore
