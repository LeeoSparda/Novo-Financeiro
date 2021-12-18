import React, { useEffect, useState, useContext } from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { format } from 'date-fns';
import { Text, View } from 'react-native';
import { Surface, Button, Portal, IconButton, Dialog, Snackbar, TextInput, ActivityIndicator, List } from 'react-native-paper';
import { Submit, ListFlat } from './style';
import firebase from '../../services/firebaseConnection';
import { stringDateDMA, formatarMoeda, formatarMoedaNUM } from '../../components/repository_functions';
import { Picker } from '@react-native-picker/picker';
import { AuthContext } from '../../contexts/auth';
export default function Lancamento({ navigation, route }) {
    const [reload, setReload] = useState(false)
    const [animated, setAnimated] = useState(false)
    const [tipo, setTipo] = useState(false);
    const [valor, setValor] = useState('0')
    const [numeric, setNumeric] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 'del']);
    const [descricao, setDescricao] = useState('')
    const [date, setDate] = useState(new Date())
    const [anexo, setAnexo] = useState()
    const [categoria, setCategoria] = useState("OUTRO")
    const [visible, setVisible] = useState(false);
    const { user: usuario } = useContext(AuthContext);
    //expaned
    const [expanded, setExpanded] = useState(true);
    const handlePress = () => setExpanded(!expanded);
    //
    // snackbar[
    //snack
    const [visibleSnack, setVisibleSnack] = useState(false);
    const [messageSnack, setMessageSnack] = useState('');
    const [styleSnack, setStyleSnack] = useState(false)
    const onDismissSnackBar = () => setVisibleSnack(false);
    function onSnack(status, message, style) {
        setVisibleSnack(status);
        setMessageSnack(message)
        setStyleSnack(style)
    }
    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);
    useEffect(() => {
        async function init() {
            const { valor, descricao, data, categoria, tipo, documentId } = route.params
            console.log(route.params)

            setValor(valor);
            setAnexo(documentId);
            setDescricao(descricao);
            setDate(data ? data : new Date());
            if (categoria)
                setCategoria(categoria)
            setTipo(tipo);
            const realm = await getRealm();
            const _user = realm.objects('User')
            setUser(_user[0]);
        }
        navigation.addListener('focus', () => setReload(!reload))
        init()
    }, [reload, navigation]);

    function calc(value) {
        if (valor != 0)
            setValor(valor + "" + value)
        else
            setValor(value);
    }

    function onDelete() {
        setValor(0);
    }

    function ItemNum({ data }) {
        if (data == 'del') {
            return (<Submit onPress={() => onDelete()} style={{ width: 65, height: 65, backgroundColor: tipo ? '#00C441' : '#f64a4a', borderRadius: 30, alignItems: 'center', justifyContent: 'center', margin: 2 }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Del</Text>
            </Submit>)
        }
        return (
            <Submit onPress={() => calc(data)} style={{ width: 65, height: 65, backgroundColor: tipo ? '#00C441' : '#f64a4a', borderRadius: 30, alignItems: 'center', justifyContent: 'center', margin: 2 }}>
                <Text style={{ fontSize: 32, fontWeight: 'bold' }}>{data}</Text>
            </Submit>
        )
    }

    async function handleAdd(_tipo, _valor, _descricao, _categoria){
        try {
            let uid = usuario.uid; 
            let key = await firebase.database().ref('historico').child(uid).push().key;
            await firebase.database().ref('historico').child(uid).child(key).set({
              tipo: tipo ? "Receita" : "Despesa",
              valor: _valor,
              categoria: _categoria,
              descricao: _descricao,
              date: format(new Date(), "dd 'de' MMMM 'de' yyyy'")
        }).catch(e=>{
                console.log('e', );
        })       //Atualizar o nosso saldo
         let user = firebase.database().ref('users').child(uid);
         await user.once('value').then((snapshot)=>{
           let saldo = parseFloat(snapshot.val().saldo);
           tipo === 'despesa' ? saldo -= parseFloat(valor) : saldo += parseFloat(valor);
           user.child('saldo').set(saldo);
         });
         onSnack(true, `${tipo ? "Receita":"Despesa" } adicionada`, tipo)
         setValor('0');
         setDescricao('')

        } catch (error) {
                console.log('error', error)
        }
      }

    return (
        <Surface style={{ flex: 1, alignItems: 'center', backgroundColor:'#000'}}>
            <View style={{ justifyContent: "space-between", height: 150, backgroundColor: tipo ? '#00C441' : '#f64a4a', padding: 15 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Button onPress={() => setTipo(true)} style={{ width: ' 50%' }} color='#fff'>Receita</Button>
                    <Button onPress={() => setTipo(false)} style={{ width: ' 50%' }} color='#fff'>Despesa</Button>
                </View>
                <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 42, color: tipo ? '#c7c7c7' : '#c7c7c7' }}>R$ {formatarMoeda(valor)}</Text>
                </View>
            </View>
            {animated ? <ActivityIndicator animating={animated} /> : null}
            {tipo ?
                <List.Accordion title="Descrição do lançamento" id="1" expanded={expanded} onPress={handlePress}>
                    <Surface style={{ padding: 0, elevation: 1, borderRadius: 5 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                            <TextInput
                                style={{ width: '60%', marginRight: 5 }}
                                label="Descrição"
                                value={descricao}
                                onChangeText={setDescricao}
                            />
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{stringDateDMA(date)}</Text>
                                <IconButton
                                    icon="calendar-blank"
                                    size={30}
                                    onPress={() => showDialog()}
                                />
                            </View>
                        </View>

                        <View style={{ padding: 5, margin: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Text>Categoria</Text>
                                <Picker
                                    selectedValue={categoria}
                                    mode='dialog'
                                    style={{
                                        width: 200
                                    }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setCategoria(itemValue)
                                    }>
                                    <Picker.Item label="Outros" value="OUTRO" />
                                    <Picker.Item label="salário" value="SALARIO" />
                                    <Picker.Item label="Investimento" value="INVESTIMENTO" />

                                    <Picker.Item label="Salario" value="SALARIO" />
                                </Picker>
                            </View>
                        </View>
                    </Surface>
                </List.Accordion> :
                    <Surface style={{ padding: 0, elevation: 1, borderRadius: 5, backgroundColor:'#909090' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                            <TextInput
                                style={{ width: '100%', marginRight: 5, }}
                                label="Descrição"
                                mode='outlined'
                                value={descricao}
                                onChangeText={setDescricao}
                            />
                        </View>
                        <View style={{ padding: 5, margin: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <View>
                                <Text>Categoria</Text>
                                <Picker
                                    selectedValue={categoria}
                                    mode='dialog'
                                    style={{
                                        width: 200
                                    }}
                                    onValueChange={(itemValue, itemIndex) =>
                                        setCategoria(itemValue)
                                    }>
                                    <Picker.Item label="Outros" value="OUTRO" />
                                    <Picker.Item label="Mercado" value="MERCADO" />
                                    <Picker.Item label="Alimentação" value="ALIMENTACAO" />
                                    <Picker.Item label="Laser" value="LAZER" />
                                    <Picker.Item label="Investimentos" value="INVESTIMENTO" />
                                    <Picker.Item label="Compras" value="COMPRA" />
                                    <Picker.Item label="Dívidas e empréstimos" value="DIVIDA-EMPRESTIMO" />
                                    <Picker.Item label="Trabalho" value="TRABALHO" />
                                    <Picker.Item label="Saúde" value="SAÚDE" />
                                    <Picker.Item label="Assinatura e serviços" value="ASSINATURA-SERVICO" />
                                    <Picker.Item label="Pets" value="PET" />
                                    <Picker.Item label="Transportes" value="TRANSPORT" />
                                    <Picker.Item label="Casa" value="CASA" />
                                </Picker>
                            </View>
                            {anexo ? null  : <Icon name='attachment' size={30} />}
                        </View>
                    </Surface>
              }

      
            <View style={{ flex: 3, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1, marginBottom: -30 }}></View>
                <ListFlat
                    numColumns={3}
                    data={numeric}
                    keyExtractor={index => String(index)}
                    renderItem={({ item }) => <ItemNum data={item} />}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: -20, alignItems: 'center' }}>
                    <IconButton
                        icon="check"
                        color='#c7c7c7'
                        animated={true}
                        style={{ backgroundColor: tipo ? '#00C441' : '#f64a4a', margin: 20 }}
                        size={40}
                        onPress={() => handleAdd(tipo, valor, descricao, categoria)}
                    />
                </View>
            </View>
            <Snackbar
                visible={visibleSnack}
                style={styleSnack ? { backgroundColor: '#00C441' } : { backgroundColor: '#f64a4a' }}
                onDismiss={onDismissSnackBar}
                action={{
                    label: 'ok',
                    onPress: () => { onDismissSnackBar }
                }}>
                <Text style={{ color: '#fff', textAlign: 'center' }}>
                    {messageSnack}
                </Text>
            </Snackbar>
        </Surface>
    );
}