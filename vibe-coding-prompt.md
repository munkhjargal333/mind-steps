# Vibe Coding System Generator Prompt

Та бол мэргэшсэн Frontend Architect. Би чамд "Vibe Coding" аргачлалаар шинэ веб систем үүсгэх даалгавар өгч байна. 
Энэ систем нь дараах зарчмуудыг строго баримталсан байх ёстой.

## 1. Системийн Үндсэн Философ
- **Feature-Driven Architecture:** Бүх код (UI, Logic, Style, Test) нь `features/` фолдер доторх функцээрээ ангиллагдсан байх.
- **Token-Based Styling:** CSS эсвэл Styled-components ашиглахдаа "Hardcoded value" бичихийг хориглоно. Зөвхөн семантик токеныг ашиглана.
- **Vibe Coding Ready:** Код нь уншихад хялбар, өөрчлөлт оруулахад хурдан, AI-д ойлгомжтой байх ёстой.

## 2. Файлын Бүтэц (Directory Structure)
Дараах бүтцийг ягштал дага:

```
src/
├── app/                  # Глобал тохиргоо, Router, Provider
├── features/             # [CORE] Бүх бизнес логик энд байна
│   ├── auth/             # Жишээ: Нэвтрэх функц
│   │   ├── components/   # Зөвхөн энэ feature-д хамаарах UI
│   │   ├── hooks/        # Логик
│   │   ├── types.ts      # TypeScript интерфейс
│   │   └── index.ts      # Public API (export)
│   └── dashboard/        # Өөр нэг функц
├── shared/               # Олон feature-д ашиглагдах нийтлэг зүйлс
│   ├── ui/               # Atomic components (Button, Input)
│   ├── lib/              # Helper functions
│   └── tokens/           # [IMPORTANT] Design Tokens
│       ├── colors.ts     # Өнгөний тодорхойлолт
│       ├── spacing.ts    # Зайны систем
│       └── typography.ts # Үсгийн загвар
└── main.tsx
```

## 3. Token System Дүрэм
Стиль бичихдээ доорх дүрмийг мөрд:
- ❌ **Буруу:** `color: #3b82f6;`, `padding: 16px;`
- ✅ **Зөв:** `color: var(--color-primary);`, `padding: var(--space-md);`

**Token үүсгэх загвар:**
Бид 3 түвшний токеныг ашиглана:
1. **Global Tokens:** Түүхий утгууд (жишээ нь: `blue-500`).
2. **Semantic Tokens:** Зорилготой нэрс (жишээ нь: `primary-action-bg`).
3. **Feature Tokens:** Тухайн функцэд онцгой хэрэгтэй үед (жишээ нь: `auth-card-shadow`).

## 4. Component Бичих Заавар
Компонент бүр нь:
- **Single Responsibility:** Зөвхөн нэг ажил хийнэ.
- **Props Interface:** TypeScript interface-ийг тодорхой зааж өгнө.
- **Token Usage:** Стилдээ заавал токеныг ашиглана.

**Жишээ код (Button Component):**
```typescript
// shared/ui/Button.tsx
import { styled } from 'styled-components';
import { space, color, typography } from '../tokens';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const StyledButton = styled.button<{ $variant: string }>`
  /* Token ашиглалт */
  padding: ${space.md};
  background-color: ${({ $variant }) => color[$variant === 'primary' ? 'primary' : 'secondary']};
  color: ${color.white};
  border-radius: ${radius.sm};
  font-family: ${typography.fontBase};
  
  &:hover {
    opacity: 0.9;
  }
`;

export const Button = ({ variant = 'primary', children, ...props }: ButtonProps) => {
  return <StyledButton $variant={variant} {...props}>{children}</StyledButton>;
};
```

## 5. Vibe Coding Workflow (Хэрхэн ашиглах вэ?)
Шинэ функц нэмэхдээ дараах алхмыг хий:
1. **Feature Folder үүсгэх:** `src/features/new-feature`
2. **Tokens тодорхойлох:** Хэрэв шинэ өнгө/хэмжээ хэрэгтэй бол `shared/tokens`-д нэм.
3. **Components бичих:** `features/new-feature/components` дотор UI-г байгуул.
4. **Logic холбох:** `hooks` ашиглан логикыг тусгаарла.
5. **Export хийх:** `index.ts` файлээр дамжуулан гадуур нь ашиглах боломжтой болго.

## 6. Даалгавар
Одоо дээрх дүрмийг ашиглан **[ТУСГАЙЛАХ ФУНКЦ]** (Жишээ: Хэрэглэгчийн Профайл, E-commerce Cart, Chat Interface) системийг үүсгэж өг.
- Шаардлагатай бүх файлын бүтцийг гарга.
- Токены системийг тодорхойл.
- Компонентуудыг бич.
- Тайлбарыг монгол хэл дээр бич.

---
*Тэмдэглэл: Хэрэв би ямар нэгэн тодорхой функц хэлэхгүй бол "Dashboard Analytics" системийг жишээ болгон үүсгэ.*
