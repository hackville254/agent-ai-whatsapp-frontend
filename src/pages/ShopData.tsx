import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Database, 
  Trash2, 
  Edit, 
  Search,
  Upload,
  Download,
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon
} from 'lucide-react';
import type { ShopData } from '@/types';

/**
 * Page de gestion des données de la boutique
 * Permet d'ajouter, modifier et organiser les produits pour l'IA
 */
export const ShopDataPage = () => {
  const { shopData, addShopData, updateShopData, deleteShopData, isLoading } = useApp();
  
  // États pour la gestion des dialogues et formulaires
  const [newProductDialog, setNewProductDialog] = useState(false);
  const [editProductDialog, setEditProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShopData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // États pour le formulaire de produit
  const [productForm, setProductForm] = useState({
    category: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: [] as string[],
    tags: [] as string[]
  });
  
  // État pour les tags en cours de saisie
  const [newTag, setNewTag] = useState('');

  /**
   * Réinitialise le formulaire de produit
   */
  const resetForm = () => {
    setProductForm({
      category: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      images: [],
      tags: []
    });
    setNewTag('');
  };

  /**
   * Gère la création d'un nouveau produit
   */
  const handleCreateProduct = async () => {
    if (productForm.name && productForm.category && productForm.description) {
      await addShopData(productForm);
      setNewProductDialog(false);
      resetForm();
    }
  };

  /**
   * Ouvre le dialogue d'édition avec les données du produit sélectionné
   */
  const handleEditProduct = (product: ShopData) => {
    setSelectedProduct(product);
    setProductForm({
      category: product.category,
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      images: product.images,
      tags: product.tags
    });
    setEditProductDialog(true);
  };

  /**
   * Sauvegarde les modifications du produit
   */
  const handleUpdateProduct = async () => {
    if (selectedProduct) {
      await updateShopData(selectedProduct.id, productForm);
      setEditProductDialog(false);
      setSelectedProduct(null);
      resetForm();
    }
  };

  /**
   * Ajoute un tag au produit
   */
  const addTag = () => {
    if (newTag.trim() && !productForm.tags.includes(newTag.trim())) {
      setProductForm(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  /**
   * Supprime un tag du produit
   */
  const removeTag = (tagToRemove: string) => {
    setProductForm(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  /**
   * Filtre les produits selon les critères de recherche
   */
  const filteredProducts = shopData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  /**
   * Obtient toutes les catégories uniques
   */
  const categories = Array.from(new Set(shopData.map(product => product.category)));

  /**
   * Retourne le badge de stock approprié
   */
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge variant="destructive">Rupture</Badge>;
    } else if (stock < 10) {
      return <Badge variant="outline" className="text-orange-600 border-orange-200">Stock faible</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-700">En stock</Badge>;
    }
  };

  /**
   * Formulaire de produit (réutilisé pour création et édition)
   */
  const ProductForm = () => (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Informations</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
          <TabsTrigger value="media">Médias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <div>
            <Label htmlFor="productName">Nom du produit</Label>
            <Input
              id="productName"
              value={productForm.name}
              onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: iPhone 15 Pro"
            />
          </div>
          
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={productForm.category} 
              onValueChange={(value) => setProductForm(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="electronics">Électronique</SelectItem>
                <SelectItem value="clothing">Vêtements</SelectItem>
                <SelectItem value="books">Livres</SelectItem>
                <SelectItem value="home">Maison</SelectItem>
                <SelectItem value="sports">Sport</SelectItem>
                <SelectItem value="beauty">Beauté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={productForm.description}
              onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Décrivez le produit en détail..."
              rows={4}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Prix (€)</Label>
              <Input
                id="price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                min={0}
                step={0.01}
              />
            </div>
            
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                min={0}
              />
            </div>
          </div>
          
          <div>
            <Label>Tags</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Ajouter un tag..."
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button type="button" onClick={addTag} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productForm.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                  {tag} ×
                </Badge>
              ))}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="media" className="space-y-4">
          <div>
            <Label>Images du produit</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Glissez-déposez vos images ici</p>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Choisir des fichiers
              </Button>
            </div>
            {productForm.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-4">
                {productForm.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img src={image} alt={`Produit ${index + 1}`} className="w-full h-20 object-cover rounded" />
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      className="absolute top-1 right-1 h-6 w-6 p-0"
                      onClick={() => setProductForm(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* En-tête de la page */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Données Boutique</h1>
          <p className="text-gray-600">Gérez votre catalogue de produits pour l'IA</p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Importer CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          
          {/* Dialogue de création de produit */}
          <Dialog open={newProductDialog} onOpenChange={setNewProductDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Produit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau produit</DialogTitle>
                <DialogDescription>
                  Ajoutez un produit à votre catalogue pour enrichir les réponses de l'IA.
                </DialogDescription>
              </DialogHeader>
              <ProductForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setNewProductDialog(false);
                  resetForm();
                }}>
                  Annuler
                </Button>
                <Button onClick={handleCreateProduct} disabled={isLoading}>
                  {isLoading ? 'Ajout...' : 'Ajouter le produit'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher des produits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <span className="capitalize">{category}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Package className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === 'table' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('table')}
              >
                <Database className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Affichage des produits */}
      {filteredProducts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Package className="w-16 h-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {shopData.length === 0 ? 'Aucun produit' : 'Aucun résultat'}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {shopData.length === 0 
                ? 'Ajoutez vos premiers produits pour enrichir les réponses de l\'IA.'
                : 'Aucun produit ne correspond à vos critères de recherche.'
              }
            </p>
            {shopData.length === 0 && (
              <Button onClick={() => setNewProductDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="relative group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="capitalize">{product.category}</CardDescription>
                  </div>
                  {getStockBadge(product.stock)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">{product.price.toFixed(2)}€</span>
                    </div>
                    <span className="text-sm text-gray-600">{product.stock} en stock</span>
                  </div>
                  
                  {product.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex space-x-2 pt-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteShopData(product.id)}>
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-gray-600 line-clamp-1">{product.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-semibold text-green-600">{product.price.toFixed(2)}€</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{product.stock}</span>
                      {getStockBadge(product.stock)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {product.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer le produit</AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce produit ?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteShopData(product.id)}>
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Dialogue d'édition de produit */}
      <Dialog open={editProductDialog} onOpenChange={setEditProductDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>
              Modifiez les informations de votre produit.
            </DialogDescription>
          </DialogHeader>
          <ProductForm />
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditProductDialog(false);
              setSelectedProduct(null);
              resetForm();
            }}>
              Annuler
            </Button>
            <Button onClick={handleUpdateProduct} disabled={isLoading}>
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};