# Adding New Components with ShadCN UI in a Vite App


## Directory Structure

By default, ShadCN UI components are added to the `components/ui` directory of your project:

src/
├── components/
│ └── ui/
│ └── button.tsx (example)


## Adding a New Component

To add a new UI component using `shadcn-ui`, use the CLI command:

>npx shadcn-ui@latest add <component-name>

Example : To add an button component:

>npx shadcn-ui@latest add button

#### What Happens
- The component files are added under components/ui/
- Any required dependencies are installed (if not already present)
- Styles and radix primitives are automatically configured

## Available Components
You can check the full list of available components here:

👉 https://ui.shadcn.com/docs/components

### Using a Component
After adding, you can directly import and use the component in your code:

// Example: Using button

```javascript
import { Button } from "@/components/ui/button";

export function SubmitButton() {
  return <Button variant="default">Submit</Button>;
}
```

## Varients 

- <Button variant="outline">Outline</Button>
- <Button variant="destructive">Delete</Button>
- <Button variant="ghost">Ghost</Button>
- <Button variant="link">Link</Button>
