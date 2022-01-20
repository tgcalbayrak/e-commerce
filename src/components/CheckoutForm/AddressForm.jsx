import React, { useState, useEffect } from 'react'
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from './CustomTextField'
import { commerce } from '../../lib/commerce'
import { Link } from 'react-router-dom'

const AddressForm = ({ checkoutToken, next }) => {
    const methods = useForm();
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    const [subdivisions, setSubdivisions] = useState([]);
    const [subdivision, setSubdivision] = useState('');
    const [options, setOptions] = useState([]);
    const [option, setOption] = useState('');

    const countries1 =  Object.entries(countries).map(([code, name]) => ({id: code, label: name}))
    const subdivisions1 =  Object.entries(subdivisions).map(([code, name]) => ({id: code, label: name}))
    const options1 =  options.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_with_code})`}));
  
    const fetchShippingCountries = async (checkoutToken) => {
        const { countries } = await commerce.services.localeListShippingCountries(checkoutToken);
        setCountries(countries)
        setCountry(Object.keys(countries)[0])
    }

    const fetchSubdivisions = async (countryCode) => {
        const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
        setSubdivisions(subdivisions);
        setSubdivision(Object.keys(subdivisions)[0]);
    }

    const fetchOptions = async (checkoutToken, country, region = null) => {
        const options = await commerce.checkout.getShippingOptions(checkoutToken, { country, region });
        setOptions(options);
        setOption(options[0].id);
    }

    useEffect(() => {  
        fetchShippingCountries(checkoutToken);
    }, [])

    useEffect(() => {
        if (country) fetchSubdivisions(country);
    }, [country])
    
    useEffect(() => {
        if (subdivision) fetchOptions(checkoutToken, country, subdivision);
    }, [subdivision])

    return (
        <>
            <Typography variant="h6" gutterBottom>Shipping Address</Typography>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit((data) => next({ ...data, country, subdivision, option }))}>
                    <Grid container spacing={3}>
                        <FormInput  name='firstName' label='First Name' />
                        <FormInput  name='lastName' label='Last Name' />
                        <FormInput  name='address1' label='Address' />
                        <FormInput  name='email' label='Email' />
                        <FormInput  name='city' label='City' />
                        <FormInput  name='zip' label='ZIP/Postal Code' />
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Country</InputLabel>
                            <Select fullWidth value={country} onChange={(e) => setCountry(e.target.value)}>
                                {countries1.map((country) => (
                                    <MenuItem key={country.id} value={country.id}>
                                        {country.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Subdivision</InputLabel>
                            <Select fullWidth value={subdivision} onChange={(e) => setSubdivision(e.target.value)}>
                                {subdivisions1.map((sub) => (
                                    <MenuItem key={sub.id} value={sub.id}>
                                        {sub.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <InputLabel>Shipping Options</InputLabel>
                            <Select fullWidth value={option} onChange={(e) => setOption(e.target.value)}>
                                {options1.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                    <br />
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                        <Button type="submit" variant="contained" color="primary">Next</Button>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default AddressForm
