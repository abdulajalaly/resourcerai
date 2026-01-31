import {useCallback} from 'react'
import type {ArrayOfObjectsInputProps} from 'sanity'
import {PatchEvent, set} from 'sanity'
import {PROPERTY_PRESETS} from '../schemas/propertyPresets'

export function PropertyInput(props: ArrayOfObjectsInputProps) {
  const {onChange, value = []} = props as ArrayOfObjectsInputProps & {
    value?: any[]
  }

  const addPreset = useCallback(
    (preset: any) => {
      const newProperty = {
        _type: 'property',
        _key: Math.random().toString(36).substring(2),
        key: preset.key,
        displayName: preset.displayName,
        type: preset.type,
        icon: preset.icon,
        filterPriority: preset.filterPriority,
        showInCard: preset.showInCard,
        unit: preset.unit,
        value: '', // user fills this
      }

      const next = [...((value as any[]) || []), newProperty]
      onChange(PatchEvent.from(set(next)))
    },
    [onChange],
  )

  return (
    <div>
      {props.renderDefault(props)}

      <div style={{marginTop: 16, padding: 16, background: '#f3f3f3', borderRadius: 4}}>
        <h4 style={{margin: '0 0 12px 0', fontSize: 14, fontWeight: 600}}>
          Quick Add Common Properties:
        </h4>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {PROPERTY_PRESETS.map((preset) => {
            const exists = (value as any[]).some((prop: any) => prop?.key === preset.key)
            return (
              <button
                key={preset.key}
                onClick={() => addPreset(preset)}
                disabled={exists}
                style={{
                  padding: '6px 12px',
                  fontSize: 13,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  background: exists ? '#e0e0e0' : 'white',
                  cursor: exists ? 'not-allowed' : 'pointer',
                  opacity: exists ? 0.5 : 1,
                }}
                type="button"
              >
                {preset.icon} {preset.displayName}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
