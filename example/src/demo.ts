import * as m from 'mithril'
import * as stream from 'mithril/stream'
import range from '../../src'
// Range exposes a quantize function so we can easily
// sync our app values with possible range values.
import {quantize} from '../../src'

// Horizontal range values
const value1 = stream(0)
const min1 = stream(0)
const max1 = stream(100)
const step1 = stream(1)
// Vertical range values
const value2 = stream(0)
const min2 = stream(0)
const max2 = stream(100)
const step2 = stream(1)

/** Demo component */
export default {
	view() {
		return m('div',
			m('.demo',
				m('h2', "Horizontal"),
				m(range, {
					class: 'horizontal-range',
					min: min1(),
					max: max1(),
					step: step1(),
					value: value1(),
					id: 'horizontal-range',
					onchange: value1,
					ondrag: (val: number) => {
						value1(val)
						// Prevent redraws while dragging by returning false
						return false
					}
				}),
				m('.config',
					m('p',
						m('label', "Value: "),
						m('input', {
							type: 'text',
							value: value1().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									value1(quantize(v, min1(), max1(), step1()))
								}
							})
						})
					),
					m('p',
						m('label', "Min: "),
						m('input', {
							type: 'text',
							value: min1().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									min1(v)
									if (max1() < min1()) max1(min1())
									value1(quantize(value1(), min1(), max1(), step1()))
								}
							})
						})
					),
					m('p',
						m('label', "Max: "),
						m('input', {
							type: 'text',
							value: max1().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									max1(v)
									if (min1() > max1()) min1(max1())
									value1(quantize(value1(), min1(), max1(), step1()))
								}
							})
						})
					),
					m('p',
						m('label', "Step: "),
						m('input', {
							type: 'text',
							value: step1().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									step1(v)
									value1(quantize(value1(), min1(), max1(), step1()))
								}
							})
						})
					)
				)
			),
			// Vertical demo
			m('.demo', {style: {marginTop: '0.5em'}},
				m('h2', "Vertical"),
				m(range, {
					class: 'vertical-range',
					min: min2(),
					max: max2(),
					step: step2(),
					orientation: 'vertical',
					value: value2(),
					id: 'vertical-range',
					onchange: value2,
					ondrag: value2
				}),
				m('.config',
					m('p',
						m('label', "Value: "),
						m('input', {
							type: 'text',
							value: value2().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									value2(quantize(v, min2(), max2(), step2()))
								}
							})
						})
					),
					m('p',
						m('label', "Min: "),
						m('input', {
							type: 'text',
							value: min2().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									min2(v)
									if (max2() < min2()) max1(min2())
									value2(quantize(value2(), min2(), max2(), step2()))
								}
							})
						})
					),
					m('p',
						m('label', "Max: "),
						m('input', {
							type: 'text',
							value: max2().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									max2(v)
									if (min2() > max2()) min2(max2())
									value2(quantize(value2(), min2(), max2(), step1()))
								}
							})
						})
					),
					m('p',
						m('label', "Step: "),
						m('input', {
							type: 'text',
							value: step2().toString(),
							onblur: m.withAttr('value', (val: string) => {
								const v = Number(val)
								if (!Number.isNaN(v)) {
									step2(v)
									value2(quantize(value2(), min2(), max2(), step1()))
								}
							})
						})
					)
				)
			)
		)
	}
} as m.Component<{},{}>
