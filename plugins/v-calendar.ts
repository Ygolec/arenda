// import this after install `@mdi/font` package
import { setupCalendar, Calendar, DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

export default defineNuxtPlugin((app) => {

    app.vueApp.use(setupCalendar,{

    })

    app.vueApp.component('VCalendar', Calendar)
    app.vueApp.component('VDatePickerVCalendar', DatePicker)
})
