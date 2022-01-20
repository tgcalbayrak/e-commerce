import React from 'react'
import { TextField, Grid } from '@material-ui/core'
import { useForm, Controller } from 'react-hook-form'

const FormInput = ({ name, label }) => {
    // const { control } = useFormContext();
    const {
        handleSubmit,
        control,
        formState: { errors }
      } = useForm();
    return (
       <Grid item xs={12} sm={6}>
          <Controller
              name="firstName"
              control={control}
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { ref, ...field } }) => (
                  <TextField
                  {...field}
                  inputRef={ref}
                  id="firstName"
                  autoComplete="fname"
                  variant="outlined"
                  fullWidth
                  error={!!errors.firstName}
                  label={label}
                  name={name}
                  required
              />
            )}
          />
       </Grid>
    )
}

export default FormInput
