# Input

<!-- 👉 Basic -->
<Demo>

## Basic

You can use `AInput` component to render basic input.

<div class="grid-row sm:grid-cols-2 place-items-stretch">
    <div>
        <DemoInputBasic />
    </div>
</div>

<template #code>

<<< @/demos/input/DemoInputBasic.vue

</template>

</Demo>

<!-- 👉 Placeholder -->
<Demo>

## Placeholder

You can use `placeholder` attribute to add placeholder to the input.

<div class="grid-row sm:grid-cols-2 place-items-stretch">
    <div>
        <DemoInputPlaceholder />
    </div>
</div>

<template #code>

<<< @/demos/input/DemoInputPlaceholder.vue

</template>

</Demo>

<!-- 👉 Label -->
<Demo>

## Label

You can use `label` prop to add label to the input.

For maximum flexibility you can use `label` slot.

<DemoInputLabel />

:::warning
When you use **label slot**, Note that label's `for` attribute needs to prefix the `a-input-` when binding it to input's `id` attribute.
:::

<template #code>

<<< @/demos/input/DemoInputLabel.vue{11,16}

</template>

</Demo>

<!-- 👉 Hint -->
<Demo>

## Hint

You can use `hint` prop to add hint to the input.

<div class="grid-row sm:grid-cols-2 place-items-stretch">
    <div>
        <DemoInputHint />
    </div>
</div>

<template #code>

<<< @/demos/input/DemoInputHint.vue

</template>

</Demo>

<!-- 👉 Icons -->
<Demo>

## Icons

You can use various icon location prop to add icon to the input.

<DemoInputIcons />

<template #code>

<<< @/demos/input/DemoInputIcons.vue

</template>

</Demo>

<!-- 👉 Sizing -->
<Demo>

## Sizing

You can use font-size utility to adjust the size of input.

<DemoInputSizing />

<template #code>

<<< @/demos/input/DemoInputSizing.vue

</template>

</Demo>

:::tip
Like `AInput`, `ASelect` & `ATextarea` also built on top of `ABaseInput` base component. Hence, This demo also applies to `ASelect` & `ATextarea`.
:::

<!-- 👉 Roundness -->
<Demo>

## Roundness

You can adjust input roundness by providing border-radius utilities to `input-wrapper-classes` prop.

<DemoInputRoundness />

<template #code>

<<< @/demos/input/DemoInputRoundness.vue

</template>

</Demo>

:::tip
Like `AInput`, `ASelect` & `ATextarea` also built on top of `ABaseInput` base component. Hence, This demo also applies to `ASelect` & `ATextarea`.
:::

<!-- 👉 Types -->
<Demo>

## Types

You can use `type` attribute to add input type.

<DemoInputTypes />

<template #code>

<<< @/demos/input/DemoInputTypes.vue

</template>

</Demo>

<!-- 👉 States -->
<Demo>

## States

You can use `readonly` prop to make input read only.

Use `disabled` prop to make input disabled.

<DemoInputStates />

<template #code>

<<< @/demos/input/DemoInputStates.vue

</template>

</Demo>

<!-- 👉 Validation -->
<Demo>

## Validation

Anu do not provide any validation mechanism at the moment as it assume it's better handled by third-party libraries like [VeeValidate](https://vee-validate.logaretm.com/)

<div class="grid-row sm:grid-cols-2 place-items-stretch">
    <div>
        <DemoInputValidation />
    </div>
</div>

<template #code>

<<< @/demos/input/DemoInputValidation.vue

</template>

</Demo>
